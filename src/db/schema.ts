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
