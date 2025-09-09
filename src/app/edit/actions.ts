"use server"

import { unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { and, eq, max } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "~/db"
import { linkCategory, linkClick, linkTable } from "~/db/schema"

export async function createLink(formData: FormData) {
	const name = formData.get("name") as string
	const url = formData.get("url") as string
	const file = formData.get("file") as File | null
	const description = formData.get("description") as string
	const categoryId = formData.get("categoryId") as string

	if (!name || !url || !categoryId) {
		throw new Error("Name, URL, and category are required")
	}

	let filename: string | null = null

	if (file && file.size > 0) {
		const fileExtension = path.extname(file.name)
		filename = `${name.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}${fileExtension}`

		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)
		const filePath = path.join(process.cwd(), "uploads", filename)

		await writeFile(filePath, buffer)
	}

	const maxOrderResult = await db
		.select({ maxOrder: max(linkTable.sortOrder) })
		.from(linkTable)
		.where(eq(linkTable.categoryId, categoryId))

	const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1

	await db.insert(linkTable).values({
		name,
		url,
		filename,
		description: description || null,
		categoryId,
		sortOrder: nextOrder,
		active: true
	})

	revalidatePath("/edit")
}

export async function updateLink(formData: FormData) {
	const id = formData.get("id") as string
	const name = formData.get("name") as string
	const url = formData.get("url") as string
	const file = formData.get("file") as File | null
	const description = formData.get("description") as string

	if (!id || !name || !url) {
		throw new Error("ID, name, and URL are required")
	}

	const updateData: {
		name: string
		url: string
		description: string | null
		updatedAt: Date
		filename?: string
	} = {
		name,
		url,
		description: description || null,
		updatedAt: new Date()
	}

	if (file && file.size > 0) {
		const fileExtension = path.extname(file.name)
		const filename = `${file.name.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}${fileExtension}`

		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)
		const filePath = path.join(process.cwd(), "uploads", filename)

		await writeFile(filePath, buffer)
		updateData.filename = filename
	}

	await db.update(linkTable).set(updateData).where(eq(linkTable.id, id))

	revalidatePath("/edit")
}

export async function toggleLinkActive(id: string, active: boolean) {
	await db
		.update(linkTable)
		.set({
			active,
			updatedAt: new Date()
		})
		.where(eq(linkTable.id, id))

	revalidatePath("/edit")
}

export async function deleteLink(id: string) {
	const link = await db
		.select()
		.from(linkTable)
		.where(eq(linkTable.id, id))
		.limit(1)

	if (link.length > 0 && link[0]?.filename) {
		try {
			const filePath = path.join(process.cwd(), "uploads", link[0].filename)
			await unlink(filePath)
		} catch (error) {
			console.warn(`Failed to delete file ${link[0].filename}:`, error)
		}
	}

	// Delete all analytics data for this link
	await db.delete(linkClick).where(eq(linkClick.linkId, id))

	// Delete the link itself
	await db.delete(linkTable).where(eq(linkTable.id, id))

	revalidatePath("/edit")
}

export async function getCategories() {
	return await db.select().from(linkCategory)
}

export async function getLinksByCategory(categoryId: string) {
	return await db
		.select()
		.from(linkTable)
		.where(eq(linkTable.categoryId, categoryId))
		.orderBy(linkTable.sortOrder)
}

export async function createCategory(name: string) {
	if (!name || name.trim() === "") {
		throw new Error("Category name is required")
	}

	const normalizedName = name.toLowerCase().replace(/ /g, "-")

	if (!/^[a-z0-9-]+$/.test(normalizedName)) {
		throw new Error(
			"Category name must only contain lowercase letters, numbers, and dashes"
		)
	}

	if (
		["main", "edit", "analytics", "uploads", "api"].includes(normalizedName)
	) {
		throw new Error("Category name cannot be a reserved keyword")
	}

	const result = await db
		.insert(linkCategory)
		.values({ id: normalizedName })
		.returning()
	revalidatePath("/edit")
	return result[0]
}

export async function reorderLinks(categoryId: string, linkIds: string[]) {
	for (let i = 0; i < linkIds.length; i++) {
		const linkId = linkIds[i]
		if (linkId) {
			await db
				.update(linkTable)
				.set({ sortOrder: i, updatedAt: new Date() })
				.where(
					and(eq(linkTable.id, linkId), eq(linkTable.categoryId, categoryId))
				)
		}
	}

	revalidatePath("/edit")
	revalidatePath(`/${categoryId}`)
}
