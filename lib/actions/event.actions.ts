'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import seedEvents from '@/lib/seed-events';

export const getAllEvents = async () => {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 }).lean();

        return events.length > 0 ? events : seedEvents;
    } catch {
        return seedEvents;
    }
}

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();
    } catch {
        return [];
    }
}