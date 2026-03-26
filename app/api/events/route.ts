import {NextRequest, NextResponse} from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';
import { getAllEvents } from '@/lib/actions/event.actions';
import { getPostHogClient } from "@/lib/posthog-server";

type EventPayload = {
    title: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
};

function parseArrayField(value: FormDataEntryValue | string[] | undefined, fieldName: string) {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== 'string') {
        throw new Error(`${fieldName} is required`);
    }

    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
        throw new Error(`${fieldName} must be an array`);
    }

    return parsedValue;
}

function normalizeMode(mode: string) {
    const normalizedMode = mode.trim().toLowerCase();

    if (normalizedMode.includes('hybrid')) {
        return 'hybrid';
    }

    if (normalizedMode.includes('offline') || normalizedMode.includes('in-person')) {
        return 'offline';
    }

    if (normalizedMode.includes('online') || normalizedMode.includes('virtual')) {
        return 'online';
    }

    throw new Error('Mode must be online, offline, or hybrid');
}

function normalizeEventPayload(payload: Record<string, unknown>): EventPayload {
    const agenda = parseArrayField(payload.agenda as string[] | string | undefined, 'agenda');
    const tags = parseArrayField(payload.tags as string[] | string | undefined, 'tags');

    return {
        title: String(payload.title ?? '').trim(),
        description: String(payload.description ?? '').trim(),
        overview: String(payload.overview ?? '').trim(),
        image: String(payload.image ?? '').trim(),
        venue: String(payload.venue ?? '').trim(),
        location: String(payload.location ?? '').trim(),
        date: String(payload.date ?? '').trim(),
        time: String(payload.time ?? '').trim(),
        mode: normalizeMode(String(payload.mode ?? '')),
        audience: String(payload.audience ?? '').trim(),
        agenda: agenda.map((item) => String(item).trim()).filter(Boolean),
        organizer: String(payload.organizer ?? '').trim(),
        tags: tags.map((item) => String(item).trim()).filter(Boolean),
    };
}

async function uploadImage(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
            if(error) return reject(error);

            resolve(results);
        }).end(buffer);
    });

    return (uploadResult as { secure_url: string }).secure_url;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const contentType = req.headers.get('content-type') ?? '';
        let eventPayload: EventPayload;

        if (contentType.includes('application/json')) {
            const body = await req.json();
            eventPayload = normalizeEventPayload(body);
        } else {
            const formData = await req.formData();
            const event = Object.fromEntries(formData.entries());
            const file = formData.get('image');

            if (file instanceof File && file.size > 0) {
                event.image = await uploadImage(file);
            }

            eventPayload = normalizeEventPayload(event);
        }

        const createdEvent = await Event.create(eventPayload);

        const posthog = getPostHogClient();
        posthog.capture({
            distinctId: 'server',
            event: 'event_created',
            properties: {
                title: createdEvent.title,
                slug: createdEvent.slug,
                location: createdEvent.location,
            },
        });
        await posthog.shutdown();

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        if (e instanceof SyntaxError) {
            return NextResponse.json({ message: 'Invalid event payload', error: e.message }, { status: 400 })
        }

        if (e instanceof Error && e.message.includes('Mode must be')) {
            return NextResponse.json({ message: 'Invalid mode value', error: e.message }, { status: 400 })
        }

        console.error(e);

        const posthog = getPostHogClient();
        posthog.capture({
            distinctId: 'server',
            event: 'event_creation_failed',
            properties: {
                error: e instanceof Error ? e.message : 'Unknown',
            },
        });
        await posthog.shutdown();

        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 })
    }
}

export async function GET() {
    try {
        const events = await getAllEvents();

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}