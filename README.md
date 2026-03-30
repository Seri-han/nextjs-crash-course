
# DevEvent

DevEvent is a Next.js App Router application for discovering developer events and booking a spot with an email address. It includes a featured-events homepage, event detail pages, booking flow, MongoDB persistence, and PostHog analytics.

## Live App

- Production: https://devevents-two-eta.vercel.app/

## What It Does

- Shows featured developer events on the homepage
- Renders dedicated event pages at `/events/[slug]`
- Lets visitors submit a booking with their email address
- Stores events and bookings in MongoDB when a database is configured
- Seeds the database with starter event data when the events collection is empty
- Captures product analytics with PostHog on the client and server
- Supports event creation through the API, including image uploads to Cloudinary

## Tech Stack

- Next.js 16.2.1
- React 19
- TypeScript
- Tailwind CSS 4
- MongoDB + Mongoose
- PostHog
- Cloudinary

## Local Development

### Prerequisites

- Node.js 20+
- npm
- MongoDB Atlas or another reachable MongoDB instance
- PostHog project credentials if you want analytics enabled
- Cloudinary credentials if you want image upload support for `POST /api/events`

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root.

```env
MONGODB_URI=

NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

POSTHOG_API_KEY=
POSTHOG_HOST=https://us.i.posthog.com

CLOUDINARY_URL=
```

Notes:

- `MONGODB_URI` is required for persistent reads and writes.
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` enables client-side analytics initialized in `instrumentation-client.ts`.
- `POSTHOG_API_KEY` enables server-side event capture in API routes.
- `CLOUDINARY_URL` is needed only if you use the event creation endpoint with file uploads.
- The app proxies PostHog ingestion through `/ingest` using `next.config.ts` rewrites.

### Run

```bash
npm run dev
```

Open http://localhost:3000.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## App Routes

### Pages

- `/` - homepage with featured events
- `/events/[slug]` - event detail page and booking form

### API

- `GET /api/events` - fetch all events
- `GET /api/events/[slug]` - fetch a single event by slug
- `POST /api/events` - create a new event

## Event Creation API

`POST /api/events` accepts either JSON or `multipart/form-data`.

Expected fields:

- `title`
- `description`
- `overview`
- `image`
- `venue`
- `location`
- `date`
- `time`
- `mode`
- `audience`
- `agenda`
- `organizer`
- `tags`

Behavior:

- `agenda` and `tags` must be arrays, or JSON-encoded arrays in form submissions.
- `mode` is normalized to `online`, `offline`, or `hybrid`.
- If `image` is uploaded as a file, the API uploads it to Cloudinary first.

## Seeding and Fallback Behavior

- On the first successful event read, the app seeds starter events from `lib/seed-events.ts` if the events collection is empty.
- If MongoDB is unavailable, event reads fall back to the in-repo seed data so the UI can still render.
- Bookings and newly created events are not persisted when the database is unavailable.

## Analytics

PostHog is integrated on both the client and server.

Tracked events currently include:

- `explore_events_clicked`
- `event_card_clicked`
- `event_booked`
- `event_created`
- `event_creation_failed`

Client-side analytics are initialized in `instrumentation-client.ts`. Server-side analytics are sent from `lib/posthog-server.ts` and the event API routes.

## Deployment Notes

- Live deployment is on Vercel: https://devevents-two-eta.vercel.app/
- Add the same environment variables from `.env.local` to your Vercel project settings.
- Keep the `/ingest` rewrites in `next.config.ts` so PostHog proxying continues to work.
- MongoDB must be reachable from Vercel for persistent data.
- `next.config.ts` currently sets `typescript.ignoreBuildErrors` to `true`, so a production deployment can succeed even if TypeScript issues exist. Tighten that before treating the app as production-hardened.

## Current Caveats

- There is no authentication layer yet.
- Any client that can reach the API can attempt to create events or bookings.
- The seed dataset is intentionally small and should be expanded for real usage.

## Project Structure

```text
app/
  api/events/
  events/[slug]/
components/
database/
lib/
  actions/
public/
```

## License

This project does not currently declare a license in the repository.