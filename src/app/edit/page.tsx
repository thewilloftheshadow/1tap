import { desc } from "drizzle-orm"
import { AuthGuard } from "~/components/AuthGuard"
import { EditLinkCard } from "~/components/EditLinkCard"
import { EditLinkForm } from "~/components/EditLinkForm"
import { db } from "~/db"
import { linkTable } from "~/db/schema"
import { verifyPassword } from "./auth"

export default async function EditPage() {
	const links = await db
		.select()
		.from(linkTable)
		.orderBy(desc(linkTable.createdAt))

	return (
		<AuthGuard authenticateAction={verifyPassword}>
			<div className="w-full max-w-6xl lg:w-[75%] xl:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-5">
				<EditLinkForm />

				{links.map((link) => (
					<EditLinkCard key={link.id} link={link} />
				))}
			</div>
		</AuthGuard>
	)
}
