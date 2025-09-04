"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { titleCase } from "~/lib/utils"

export default function Header({
	logoUrl,
	productName
}: {
	logoUrl: string
	productName: string
}) {
	const pathname = usePathname()
	return (
		<header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border px-5 py-1 flex flex-row justify-between items-center">
			<Link href="/" rel="noreferrer" className="flex items-center">
				<Image
					src={logoUrl}
					alt={`${productName} Logo`}
					width={40}
					height={40}
					className="size-10"
				/>
				<span className="text-primary-foreground font-bold text-lg">
					{productName}{" "}
					{pathname === "/"
						? ""
						: `- ${titleCase(pathname.split("/").join(" "))}`}
				</span>
			</Link>
			{pathname !== "/" ? (
				<Link
					href="/"
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					← Back to Site
				</Link>
			) : null}
		</header>
	)
}
