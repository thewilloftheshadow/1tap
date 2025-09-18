import { defineConfig } from "drizzle-kit"
export default defineConfig({
	dialect: "sqlite",
	schema: "./src/db/schema.ts",
	dbCredentials: {
		url:
			process.env.NODE_ENV === "production" ? "/app/data/app.db" : "./local.db"
	}
})
