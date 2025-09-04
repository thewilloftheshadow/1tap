import { Inter } from "next/font/google"
import "~/styles/globals.css"
import Header from "~/components/Header"
import { env } from "~/lib/env"

const inter = Inter({
	subsets: ["latin"]
})

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={inter.className}>
			<body className="min-h-screen flex flex-col items-center">
				<Header logoUrl={env.LOGO_URL} productName={env.PRODUCT_NAME} />
				<main className="flex-1 pt-20 w-full flex flex-col items-center">
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
