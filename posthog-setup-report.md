<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the DevEvent Next.js App Router project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using Next.js's built-in instrumentation hook. Configured with the reverse proxy (`/ingest`), exception capture for error tracking, and debug mode in development.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client factory using `posthog-node`. Used by API routes to capture server-side events.
- **`components/ExploreBtn.tsx`** (edited): Added `posthog.capture('explore_events_clicked')` to the existing click handler.
- **`components/EventCard.tsx`** (edited): Added `'use client'` directive and `posthog.capture('event_card_clicked')` with title, slug, location, and date properties on link click.
- **`app/api/events/route.ts`** (edited): Added server-side `event_created` capture on successful event creation, and `event_creation_failed` capture on error.
- **`.env.local`** (created): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`. Already covered by `.gitignore`.
- **`next.config.ts`**: Already had PostHog reverse proxy rewrites configured — no changes needed.

## Events

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore Events" hero button | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked an event card to view details | `components/EventCard.tsx` |
| `event_created` | A new event was successfully created via the API | `app/api/events/route.ts` |
| `event_creation_failed` | Event creation failed in the API | `app/api/events/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/357710/dashboard/1401510)
- **Insight**: [Events Created Over Time](https://us.posthog.com/project/357710/insights/58aYju0p)
- **Insight**: [Event Card Click-through Rate](https://us.posthog.com/project/357710/insights/aRyoxUA5)
- **Insight**: [Explore Button Clicks](https://us.posthog.com/project/357710/insights/tZo9I7R6)
- **Insight**: [Homepage to Event Click Funnel](https://us.posthog.com/project/357710/insights/kId9Mxgb) — conversion from "Explore Events" click to event card click
- **Insight**: [Event Creation Success Rate](https://us.posthog.com/project/357710/insights/L4bB1mIb) — successful vs failed event creations side by side

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
