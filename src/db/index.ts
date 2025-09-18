import { drizzle } from "drizzle-orm/bun-sqlite"

const dbUrl =
	process.env.NODE_ENV === "production" ? "/app/data/app.db" : "./local.db"
export const db = drizzle(dbUrl)
