import { createId } from "@paralleldrive/cuid2"
import { db } from "~/db"
import { linkCategory, linkTable } from "~/db/schema"

await db
	.insert(linkCategory)
	.values({
		id: "main"
	})
	.catch(() => {})

await db
	.insert(linkTable)
	.values({
		id: createId(),
		name: "Google",
		url: "https://www.google.com",
		categoryId: "main",
		sortOrder: 1
	})
	.catch(() => {})

await db
	.insert(linkTable)
	.values({
		id: createId(),
		name: "FBG",
		url: "https://www.fbcgulfport.org",
		categoryId: "main",
		sortOrder: 2
	})
	.catch(() => {})

await db
	.insert(linkTable)
	.values({
		id: createId(),
		name: "Will Shadow",
		url: "https://www.willshadow.com",
		categoryId: "main",
		sortOrder: 3
	})
	.catch(() => {})

await db
	.insert(linkCategory)
	.values({
		id: "social"
	})
	.catch(() => {})

await db
	.insert(linkTable)
	.values({
		id: createId(),
		name: "Facebook",
		url: "https://www.facebook.com/fbcgulfport",
		categoryId: "social",
		sortOrder: 1
	})
	.catch(() => {})

await db
	.insert(linkTable)
	.values({
		id: createId(),
		name: "Instagram",
		url: "https://www.instagram.com/fbcgulfport",
		categoryId: "social",
		sortOrder: 2
	})
	.catch(() => {})

await db
	.insert(linkTable)
	.values({
		id: createId(),
		name: "Instagram",
		url: "https://www.instagram.com/fbcgulfport",
		categoryId: "social",
		sortOrder: 3
	})
	.catch(() => {})
