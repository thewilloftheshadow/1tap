import { PostHog } from "posthog-node"
import { env } from "./env"

let posthogClient: PostHog | null = null

export function getPostHogClient() {
	if (!env.POSTHOG_API_KEY) {
		return null
	}

	if (!posthogClient) {
		posthogClient = new PostHog(env.POSTHOG_API_KEY, {
			host: "https://us.i.posthog.com"
		})
	}

	return posthogClient
}

export async function captureEvent(
	distinctId: string,
	event: string,
	properties?: Record<string, any>
) {
	const client = getPostHogClient()
	if (!client) {
		// PostHog not configured, skip tracking
		return
	}

	try {
		client.capture({
			distinctId,
			event,
			properties
		})
		// Note: We don't await shutdown here as it would slow down requests
		// PostHog client will batch and send events automatically
	} catch (error) {
		console.error("Failed to capture PostHog event:", error)
	}
}

