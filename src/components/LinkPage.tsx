import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { trackCategoryVisit } from "~/app/analytics/actions"
import { LinkCard } from "~/components/LinkCard"
import { db } from "~/db"
import { linkTable } from "~/db/schema"

export async function LinkPage({ categoryId }: { categoryId: string }) {
	// Track the category visit
	await trackCategoryVisit(categoryId)

	const links = await db
		.select()
		.from(linkTable)
		.where(
			and(eq(linkTable.active, true), eq(linkTable.categoryId, categoryId))
		)
		.orderBy(linkTable.sortOrder)

	if (links.length === 0) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-muted-foreground text-xs">
					No links, check back later :(
				</p>
			</div>
		)
	}

	if (links.length === 1) {
		const link = links[0]
		if (link?.filename) {
			const fileUrl = `/uploads/${link.filename}`
			redirect(fileUrl)
		}
	}

	return (
		<div className="w-full max-w-6xl lg:w-[75%] xl:w-[60%] pb-8 px-5 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-5">
			{links.map((link) => (
				<LinkCard key={link.id} link={link} categoryId={categoryId} />
			))}
		</div>
	)
}
