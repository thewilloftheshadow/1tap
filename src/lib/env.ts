import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		PRODUCT_NAME: z.string().default("1Tap"),
		LOGO_URL: z.string().default("/logo.png"),
		API_KEY: z.string(),
		BETTER_AUTH_SECRET: z
			.string()
			.min(
				32,
				"BETTER_AUTH_SECRET is required, generate with `openssl rand -hex 32`"
			),
		BETTER_AUTH_URL: z.url(),
		AUTHORIZED_DOMAIN: z.string(),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		POSTHOG_API_KEY: z.string().optional()
	},
	client: {
		NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
		NEXT_PUBLIC_POSTHOG_KEY: z.string().optional()
	},
	runtimeEnv: {
		PRODUCT_NAME: process.env.PRODUCT_NAME,
		LOGO_URL: process.env.LOGO_URL,
		API_KEY: process.env.API_KEY,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
		NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
		AUTHORIZED_DOMAIN: process.env.AUTHORIZED_DOMAIN,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
		NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY
	}
})
