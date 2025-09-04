"use client"

import { useState } from "react"
import { deleteLink, toggleLinkActive, updateLink } from "~/app/edit/actions"
import { LinkCard } from "~/components/LinkCard"
import { Button } from "~/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Switch } from "~/components/ui/switch"
import { Textarea } from "~/components/ui/textarea"
import type { linkTable } from "~/db/schema"

export function EditLinkCard({
	link
}: {
	link: typeof linkTable.$inferSelect
}) {
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isActive, setIsActive] = useState(link.active)

	const handleToggleActive = async () => {
		const newActiveState = !isActive
		setIsActive(newActiveState)
		await toggleLinkActive(link.id, newActiveState)
	}

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this link?")) {
			await deleteLink(link.id)
		}
	}

	const handleUpdate = async (formData: FormData) => {
		formData.append("id", link.id)
		await updateLink(formData)
		setIsEditOpen(false)
	}

	return (
		<div className="relative">
			<LinkCard
				link={link}
				asLink={false}
				className={!isActive ? "opacity-50" : ""}
			>
				<div className="absolute top-2 right-2 flex gap-2">
					<Switch
						checked={isActive}
						onCheckedChange={handleToggleActive}
						className="bg-white/20 backdrop-blur-sm"
					/>
				</div>
			</LinkCard>

			<div className="flex gap-2 mt-2">
				<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm" className="flex-1">
							Edit
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Link</DialogTitle>
						</DialogHeader>
						<form action={handleUpdate} className="space-y-4">
							<div>
								<label htmlFor="name" className="text-sm font-medium">
									Name <span className="text-red-500">*</span>
								</label>
								<Input
									id="name"
									name="name"
									defaultValue={link.name}
									required
								/>
							</div>
							<div>
								<label htmlFor="url" className="text-sm font-medium">
									URL <span className="text-red-500">*</span>
								</label>
								<Input
									id="url"
									name="url"
									type="url"
									defaultValue={link.url || ""}
									placeholder="https://example.com"
									required
								/>
							</div>
							<div>
								<label htmlFor="file" className="text-sm font-medium">
									Replace Background (optional)
								</label>
								<Input id="file" name="file" type="file" accept="image/*" />
								<p className="text-xs text-muted-foreground mt-1">
									Current: {link.filename}
								</p>
							</div>
							<div>
								<label htmlFor="description" className="text-sm font-medium">
									Description
								</label>
								<Textarea
									id="description"
									name="description"
									defaultValue={link.description || ""}
									rows={3}
								/>
							</div>
							<div className="flex gap-2">
								<Button type="submit" className="flex-1">
									Save Changes
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsEditOpen(false)}
								>
									Cancel
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>

				<Button variant="destructive" size="sm" onClick={handleDelete}>
					Delete
				</Button>
			</div>
		</div>
	)
}
