import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		PRODUCT_NAME: z.string().default("1Tap"),
		LOGO_URL: z.string().default("/logo.png"),
		EDIT_PASSWORD: z.string().min(1, "EDIT_PASSWORD is required")
	},
	client: {},
	runtimeEnv: {
		PRODUCT_NAME: process.env.PRODUCT_NAME,
		LOGO_URL: process.env.LOGO_URL,
		EDIT_PASSWORD: process.env.EDIT_PASSWORD
	}
})
