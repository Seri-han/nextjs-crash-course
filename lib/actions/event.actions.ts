'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import seedEvents from '@/lib/seed-events';

function sharesTag(sourceTags: string[], candidateTags: string[]) {
    return sourceTags.some((tag) => candidateTags.includes(tag));
}

async function ensureSeedEvents() {
    const existingEvents = await Event.find().sort({ createdAt: -1 }).lean();

    if (existingEvents.length > 0) {
        return existingEvents;
    }

    await Event.create(seedEvents);

    return await Event.find().sort({ createdAt: -1 }).lean();
}

export const getAllEvents = async () => {
    try {
        await connectDB();

        return await ensureSeedEvents();
    } catch {
        return seedEvents;
    }
}

export const getEventBySlug = async (slug: string) => {
    const normalizedSlug = slug.trim().toLowerCase();

    try {
        await connectDB();

        await ensureSeedEvents();

        const event = await Event.findOne({ slug: normalizedSlug }).lean();

        if (event) {
            return event;
        }
    } catch {
        // Fall through to seeded events when the database is unavailable.
    }

    return seedEvents.find((event) => event.slug === normalizedSlug) ?? null;
}

export const getSimilarEventsBySlug = async (slug: string) => {
    const normalizedSlug = slug.trim().toLowerCase();

    try {
        await connectDB();
        await ensureSeedEvents();
        const event = await Event.findOne({ slug: normalizedSlug });

        if (!event) {
            const seedEvent = seedEvents.find((item) => item.slug === normalizedSlug);

            if (!seedEvent) {
                return [];
            }

            return seedEvents.filter(
                (item) => item.slug !== seedEvent.slug && sharesTag(seedEvent.tags, item.tags)
            );
        }

        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();
    } catch {
        const seedEvent = seedEvents.find((item) => item.slug === normalizedSlug);

        if (!seedEvent) {
            return [];
        }

        return seedEvents.filter(
            (item) => item.slug !== seedEvent.slug && sharesTag(seedEvent.tags, item.tags)
        );
    }
}