"use server"

import { headers } from "next/headers"
import { db } from "~/db"
import { categoryVisit, linkClick } from "~/db/schema"

async function getClientInfo() {
	const headersList = await headers()
	const userAgent = headersList.get("user-agent")
	const forwarded = headersList.get("x-forwarded-for")
	const realIp = headersList.get("x-real-ip")

	const ip = forwarded ? forwarded.split(",")[0]?.trim() : realIp

	return { userAgent, ip }
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

export async function trackLinkClick(linkId: string, categoryId: string) {
	try {
		const { userAgent, ip } = await getClientInfo()

		if (isBot(userAgent)) {
			return
		}

		await db.insert(linkClick).values({
			linkId,
			categoryId,
			userAgent,
			ip
		})
	} catch (error) {
		console.error("Failed to track link click:", error)
	}
}
