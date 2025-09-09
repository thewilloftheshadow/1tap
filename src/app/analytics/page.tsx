import Link from "next/link"
import { Card } from "~/components/ui/card"
import {
	getAnalyticsOverview,
	getCategoryStats,
	getCategoryVisits,
	getLinkClicks,
	getLinkStats
} from "./queries"

function formatDate(date: Date | null) {
	if (!date) return "Unknown"
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZoneName: "short"
	}).format(date)
}

function formatCategoryName(categoryId: string) {
	return categoryId
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

export default async function AnalyticsPage() {
	const [overview, categoryVisits, linkClicks, categoryStats, linkStats] =
		await Promise.all([
			getAnalyticsOverview(),
			getCategoryVisits(),
			getLinkClicks(),
			getCategoryStats(),
			getLinkStats()
		])

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Analytics Dashboard</h1>
					<Link
						href="/"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						← Back to Home
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="p-6">
						<h3 className="text-sm font-medium text-muted-foreground">
							Total Visits
						</h3>
						<p className="text-2xl font-bold">{overview.totalVisits}</p>
					</Card>
					<Card className="p-6">
						<h3 className="text-sm font-medium text-muted-foreground">
							Total Clicks
						</h3>
						<p className="text-2xl font-bold">{overview.totalClicks}</p>
					</Card>
					<Card className="p-6">
						<h3 className="text-sm font-medium text-muted-foreground">
							Categories Visited
						</h3>
						<p className="text-2xl font-bold">{overview.uniqueCategories}</p>
					</Card>
					<Card className="p-6">
						<h3 className="text-sm font-medium text-muted-foreground">
							Links Clicked
						</h3>
						<p className="text-2xl font-bold">{overview.uniqueLinks}</p>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<Card className="p-6">
						<h2 className="text-xl font-semibold mb-4">
							Top Categories by Visits
						</h2>
						<div className="space-y-3">
							{categoryStats.slice(0, 10).map((stat) => (
								<div
									key={stat.categoryId}
									className="flex justify-between items-center"
								>
									<span className="font-medium">
										{formatCategoryName(stat.categoryId)}
									</span>
									<span className="text-muted-foreground">
										{stat.visitCount} visits
									</span>
								</div>
							))}
							{categoryStats.length === 0 && (
								<p className="text-muted-foreground text-sm">
									No category visits yet
								</p>
							)}
						</div>
					</Card>

					<Card className="p-6">
						<h2 className="text-xl font-semibold mb-4">Top Links by Clicks</h2>
						<div className="space-y-3">
							{linkStats.slice(0, 10).map((stat) => (
								<div key={stat.linkId} className="space-y-1">
									<div className="flex justify-between items-center">
										<span className="font-medium truncate">
											{stat.linkName}
										</span>
										<span className="text-muted-foreground">
											{stat.clickCount} clicks
										</span>
									</div>
									<div className="flex justify-between items-center text-sm text-muted-foreground">
										<span>{formatCategoryName(stat.categoryId)}</span>
										<span className="truncate max-w-[200px]">
											{stat.linkUrl}
										</span>
									</div>
								</div>
							))}
							{linkStats.length === 0 && (
								<p className="text-muted-foreground text-sm">
									No link clicks yet
								</p>
							)}
						</div>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<Card className="p-6">
						<h2 className="text-xl font-semibold mb-4">
							Recent Category Visits
						</h2>
						<div className="space-y-3 max-h-96 overflow-y-auto">
							{categoryVisits.map((visit) => (
								<div
									key={visit.id}
									className="border-b border-border pb-3 last:border-b-0"
								>
									<div className="flex justify-between items-start">
										<div>
											<p className="font-medium">
												{formatCategoryName(visit.categoryId)}
											</p>
											<p className="text-sm text-muted-foreground">
												{formatDate(visit.visitedAt)}
											</p>
										</div>
									</div>
								</div>
							))}
							{categoryVisits.length === 0 && (
								<p className="text-muted-foreground text-sm">No visits yet</p>
							)}
						</div>
					</Card>

					<Card className="p-6">
						<h2 className="text-xl font-semibold mb-4">Recent Link Clicks</h2>
						<div className="space-y-3 max-h-96 overflow-y-auto">
							{linkClicks.map((click) => (
								<div
									key={click.id}
									className="border-b border-border pb-3 last:border-b-0"
								>
									<div className="flex justify-between items-start">
										<div>
											<p className="font-medium">{click.linkName}</p>
											<p className="text-sm text-muted-foreground">
												{formatCategoryName(click.categoryId)}
											</p>
											<p className="text-sm text-muted-foreground">
												{formatDate(click.clickedAt)}
											</p>
										</div>
									</div>
								</div>
							))}
							{linkClicks.length === 0 && (
								<p className="text-muted-foreground text-sm">No clicks yet</p>
							)}
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}
