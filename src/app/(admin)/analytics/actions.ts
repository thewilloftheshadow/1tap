"use server"

import { headers } from "next/headers"
import { db } from "~/db"
import { categoryVisit, linkClick } from "~/db/schema"
import { captureEvent } from "~/lib/posthog-server"

async function getClientInfo() {
	const headersList = await headers()
	const userAgent = headersList.get("user-agent")
	const forwarded = headersList.get("x-forwarded-for")
	const realIp = headersList.get("x-real-ip")
	const cookieHeader = headersList.get("cookie")

	const ip = forwarded ? forwarded.split(",")[0]?.trim() : realIp

	// Extract PostHog distinct_id from cookies
	let posthogDistinctId: string | undefined
	if (cookieHeader) {
		const match = cookieHeader.match(/ph_[^_]+_posthog=([^;]+)/)
		if (match?.[1]) {
			try {
				const decoded = decodeURIComponent(match[1])
				const parsed = JSON.parse(decoded)
				posthogDistinctId = parsed.distinct_id
			} catch {
				// Failed to parse PostHog cookie
			}
		}
	}

	return { userAgent, ip, posthogDistinctId }
}

function isBot(userAgent: string | null): boolean {
	if (!userAgent) return false

	const botPatterns = [
		/bot/i,
		/crawl/i,
		/spider/i,
		/curl/i,
		/wget/i,
		/lighthouse/i,
		/pagespeed/i,
		/gtmetrix/i,
		/prerender/i,
		/phantom/i,
		/headless/i,
		/scrape/i
	]

	return botPatterns.some((pattern) => pattern.test(userAgent))
}

export async function trackCategoryVisit(categoryId: string) {
	try {
		const { userAgent, ip } = await getClientInfo()

		if (isBot(userAgent)) {
			return
		}

		await db.insert(categoryVisit).values({
			categoryId,
			userAgent,
			ip
		})
	} catch (error) {
		console.error("Failed to track category visit:", error)
	}
}

export async function trackLinkClick(
	linkId: string,
	categoryId: string,
	linkUrl?: string,
	clientDistinctId?: string
) {
	try {
		const { userAgent, ip, posthogDistinctId } = await getClientInfo()

		if (isBot(userAgent)) {
			return
		}

		await db.insert(linkClick).values({
			linkId,
			categoryId,
			userAgent,
			ip
		})

		// Track with PostHog server-side
		// Priority: client-provided ID > cookie ID > IP fallback
		const distinctId = clientDistinctId || posthogDistinctId || ip || "anonymous"
		await captureEvent(distinctId, "link_card_clicked", {
			link_id: linkId,
			link_url: linkUrl,
			category_id: categoryId,
			user_agent: userAgent
		})
	} catch (error) {
		console.error("Failed to track link click:", error)
	}
}
