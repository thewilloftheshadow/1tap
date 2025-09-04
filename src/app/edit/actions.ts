"use server"

import { unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "~/db"
import { linkTable } from "~/db/schema"

export async function createLink(formData: FormData) {
	const name = formData.get("name") as string
	const url = formData.get("url") as string
	const file = formData.get("file") as File | null
	const description = formData.get("description") as string

	if (!name || !url) {
		throw new Error("Name and URL are required")
	}

	let filename: string | null = null

	// Handle optional file upload for background
	if (file && file.size > 0) {
		const fileExtension = path.extname(file.name)
		filename = `${name.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}${fileExtension}`

		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)
		const filePath = path.join(process.cwd(), "public/uploads", filename)

		await writeFile(filePath, buffer)
	}

	await db.insert(linkTable).values({
		name,
		url,
		filename,
		description: description || null,
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
		const filePath = path.join(process.cwd(), "public/uploads", filename)

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
	// First, get the link to check if it has a file
	const link = await db
		.select()
		.from(linkTable)
		.where(eq(linkTable.id, id))
		.limit(1)

	if (link.length > 0 && link[0]?.filename) {
		// Delete the file from the uploads directory
		try {
			const filePath = path.join(
				process.cwd(),
				"public/uploads",
				link[0].filename
			)
			await unlink(filePath)
		} catch (error) {
			// File might not exist, log but don't fail the deletion
			console.warn(`Failed to delete file ${link[0].filename}:`, error)
		}
	}

	// Delete the database record
	await db.delete(linkTable).where(eq(linkTable.id, id))

	revalidatePath("/edit")
}
