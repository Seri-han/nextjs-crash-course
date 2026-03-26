import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
    const apiKey = process.env.POSTHOG_API_KEY;
    const host = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com';

    if (!apiKey) {
        return {
            capture: () => undefined,
            shutdown: async () => undefined,
        };
    }

    if (!posthogClient) {
        posthogClient = new PostHog(apiKey, { host });
    }

    return posthogClient;
}