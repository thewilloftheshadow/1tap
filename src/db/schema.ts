import { createId } from "@paralleldrive/cuid2"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const linkTable = sqliteTable("links", {
	id: text()
		.$defaultFn(() => createId())
		.primaryKey(),
	active: integer({ mode: "boolean" }).notNull().default(true),
	name: text().notNull(),
	url: text().notNull(),
	filename: text(),
	description: text(),
	createdAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
})
