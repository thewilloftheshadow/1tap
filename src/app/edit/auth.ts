"use server"

import { env } from "~/lib/env"

export async function verifyPassword(password: string): Promise<boolean> {
	// Simple password check against environment variable
	return password === env.EDIT_PASSWORD
}
