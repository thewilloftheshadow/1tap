import { createId } from "@paralleldrive/cuid2"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const linkTable = sqliteTable("links", {
	id: text()
		.$defaultFn(() => createId())
		.primaryKey(),
	categoryId: text().references(() => linkCategory.id),
	active: integer({ mode: "boolean" }).notNull().default(true),
	name: text().notNull(),
	url: text().notNull(),
	filename: text(),
	description: text(),
	sortOrder: integer().notNull().default(0),
	createdAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
})

export const linkCategory = sqliteTable("link_categories", {
	id: text().primaryKey()
})

export const categoryVisit = sqliteTable("category_visits", {
	id: text()
		.$defaultFn(() => createId())
		.primaryKey(),
	categoryId: text().notNull(),
	userAgent: text(),
	ip: text(),
	visitedAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date())
})

export const linkClick = sqliteTable("link_clicks", {
	id: text()
		.$defaultFn(() => createId())
		.primaryKey(),
	linkId: text()
		.notNull()
		.references(() => linkTable.id),
	categoryId: text().notNull(),
	userAgent: text(),
	ip: text(),
	clickedAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date())
})
