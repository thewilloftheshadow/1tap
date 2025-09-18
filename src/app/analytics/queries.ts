"use server"

import { count, desc, eq, sql } from "drizzle-orm"
import { db } from "~/db"
import { categoryVisit, linkClick, linkTable } from "~/db/schema"

export async function getAnalyticsOverview() {
	try {
		const [totalVisits, totalClicks, uniqueCategories, uniqueLinks] =
			await Promise.all([
				db.select({ count: count() }).from(categoryVisit),
				db.select({ count: count() }).from(linkClick),
				db
					.select({ count: count(sql`DISTINCT ${categoryVisit.categoryId}`) })
					.from(categoryVisit),
				db
					.select({ count: count(sql`DISTINCT ${linkClick.linkId}`) })
					.from(linkClick)
			])

		return {
			totalVisits: totalVisits[0]?.count || 0,
			totalClicks: totalClicks[0]?.count || 0,
			uniqueCategories: uniqueCategories[0]?.count || 0,
			uniqueLinks: uniqueLinks[0]?.count || 0
		}
	} catch (error) {
		console.error("Failed to get analytics overview:", error)
		return {
			totalVisits: 0,
			totalClicks: 0,
			uniqueCategories: 0,
			uniqueLinks: 0
		}
	}
}

export async function getCategoryVisits() {
	try {
		const visits = await db
			.select({
				id: categoryVisit.id,
				categoryId: categoryVisit.categoryId,
				userAgent: categoryVisit.userAgent,
				ip: categoryVisit.ip,
				visitedAt: categoryVisit.visitedAt
			})
			.from(categoryVisit)
			.orderBy(desc(categoryVisit.visitedAt))
			.limit(100)

		return visits
	} catch (error) {
		console.error("Failed to get category visits:", error)
		return []
	}
}

export async function getLinkClicks() {
	try {
		const clicks = await db
			.select({
				id: linkClick.id,
				linkId: linkClick.linkId,
				linkName: linkTable.name,
				linkUrl: linkTable.url,
				categoryId: linkClick.categoryId,
				userAgent: linkClick.userAgent,
				ip: linkClick.ip,
				clickedAt: linkClick.clickedAt
			})
			.from(linkClick)
			.leftJoin(linkTable, eq(linkClick.linkId, linkTable.id))
			.orderBy(desc(linkClick.clickedAt))
			.limit(100)

		return clicks
	} catch (error) {
		console.error("Failed to get link clicks:", error)
		return []
	}
}

export async function getCategoryStats() {
	try {
		const stats = await db
			.select({
				categoryId: categoryVisit.categoryId,
				visitCount: count(categoryVisit.id)
			})
			.from(categoryVisit)
			.groupBy(categoryVisit.categoryId)
			.orderBy(desc(count(categoryVisit.id)))

		return stats
	} catch (error) {
		console.error("Failed to get category stats:", error)
		return []
	}
}

export async function getLinkStats() {
	try {
		const stats = await db
			.select({
				linkId: linkClick.linkId,
				linkName: linkTable.name,
				linkUrl: linkTable.url,
				categoryId: linkClick.categoryId,
				clickCount: count(linkClick.id)
			})
			.from(linkClick)
			.leftJoin(linkTable, eq(linkClick.linkId, linkTable.id))
			.groupBy(
				linkClick.linkId,
				linkTable.name,
				linkTable.url,
				linkClick.categoryId
			)
			.orderBy(desc(count(linkClick.id)))

		return stats
	} catch (error) {
		console.error("Failed to get link stats:", error)
		return []
	}
}
