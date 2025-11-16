"use client"

import Link from "next/link"
import posthog from "posthog-js"
import { trackLinkClick } from "~/app/(admin)/analytics/actions"

export function TrackableLink({
	linkId,
	categoryId,
	href,
	target = "_blank",
	rel = "noopener noreferrer",
	prefetch = false,
	className,
	style,
	children
}: {
	linkId: string
	categoryId: string
	href: string
	target?: string
	rel?: string
	prefetch?: boolean
	className?: string
	style?: React.CSSProperties
	children: React.ReactNode
}) {
	const handleClick = async () => {
		posthog.capture("link_card_clicked", {
			link_id: linkId,
			link_url: href,
			category_id: categoryId
		})
		try {
			await trackLinkClick(linkId, categoryId, href)
		} catch (error) {
			console.error("Failed to track click:", error)
		}
	}

	return (
		<Link
			href={href}
			target={target}
			rel={rel}
			prefetch={prefetch}
			className={className}
			style={style}
			onClick={handleClick}
		>
			{children}
		</Link>
	)
}
