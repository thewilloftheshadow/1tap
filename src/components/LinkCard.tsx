import type { linkTable } from "~/db/schema"
import { TrackableLink } from "./TrackableLink"

export function LinkCard({
	link,
	asLink = true,
	categoryId
}: {
	link: typeof linkTable.$inferSelect
	asLink?: boolean
	className?: string
	children?: React.ReactNode
	categoryId?: string
}) {
	const backgroundUrl = link.filename ? `/uploads/${link.filename}` : null
	const isImage = link.filename
		? /\.(jpg|jpeg|png|gif|webp)$/i.test(link.filename)
		: false

	const card = (
		<div className="w-full h-full bg-gradient-to-t from-black via-transparent to-transparent rounded-2xl flex flex-col justify-end items-start p-5">
			<h1 className="text-white font-bold text-lg sm:text-xl md:text-xl xl:text-xl text-left">
				{link.name}
			</h1>
			{link.description && (
				<h2 className="text-white text-start font-normal text-[10px]/[12px] sm:text-[10px]/[12px] md:text-[10px]/[12px] xl:text-[11px]/[13px]">
					{link.description}
				</h2>
			)}
		</div>
	)

	return asLink ? (
		<TrackableLink
			linkId={link.id}
			categoryId={categoryId || link.categoryId || ""}
			href={link.url ? link.url : `/`}
			rel="noopener noreferrer"
			prefetch={false}
			className="block w-full aspect-video bg-cover bg-no-repeat rounded-2xl"
			style={{
				backgroundImage:
					isImage && backgroundUrl
						? `url(${backgroundUrl})`
						: "linear-gradient(135deg, var(--primary), var(--accent))"
			}}
		>
			{card}
		</TrackableLink>
	) : (
		<div
			className="block w-full aspect-video bg-cover bg-no-repeat rounded-2xl"
			style={{
				backgroundImage:
					isImage && backgroundUrl
						? `url(${backgroundUrl})`
						: "linear-gradient(135deg, var(--primary), var(--accent))"
			}}
		>
			{card}
		</div>
	)
}
