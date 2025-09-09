import { Inter } from "next/font/google"
import "~/styles/globals.css"
import type { Metadata } from "next"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { env } from "~/lib/env"

const inter = Inter({
	subsets: ["latin"]
})

export const metadata: Metadata = {
	title: env.PRODUCT_NAME,
	icons: {
		icon: env.LOGO_URL,
		shortcut: env.LOGO_URL,
		apple: env.LOGO_URL
	},
	openGraph: {
		title: env.PRODUCT_NAME,
		images: [env.LOGO_URL],
		type: "website"
	},
	twitter: {
		card: "summary",
		title: env.PRODUCT_NAME,
		images: [env.LOGO_URL]
	}
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const headersList = await headers()
	const pathname = headersList.get("x-current-path") || "/"
	let categoryId = pathname.split("/")[1]
	if (categoryId === "edit") categoryId = ""
	return (
		<html lang="en" className={inter.className}>
			<body className="min-h-screen flex flex-col items-center">
				<header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border px-5 py-1 flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 md:gap-0">
					<div className="flex items-center">
						<Image
							src={env.LOGO_URL}
							alt={`${env.PRODUCT_NAME} Logo`}
							width={40}
							height={40}
							className="size-10"
						/>
						<span className="text-primary-foreground font-bold text-lg">
							{env.PRODUCT_NAME}
						</span>
					</div>
					<div className="flex items-center gap-4">
						{pathname === "/edit" ? (
							<>
								<Link
									href="/analytics"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Analytics
								</Link>
								<Link
									href="/"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									← Back to Site
								</Link>
							</>
						) : pathname === "/analytics" ? (
							<Link
								href="/edit"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								← Back to Edit
							</Link>
						) : null}
					</div>
				</header>
				<main className="flex-1 pt-20 mb-6 w-full flex flex-col items-center">
					{children}
				</main>
				{/* <footer className="text-muted-foreground font-normal text-xs mb-4">
					© 2025 {env.PRODUCT_NAME}.{" "}
					<span className="font-medium">All Rights Reserved.</span>
				</footer> */}
			</body>
		</html>
	)
}
