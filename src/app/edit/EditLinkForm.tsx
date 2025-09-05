"use client"

import { Loader2Icon } from "lucide-react"
import { useState } from "react"
import { createLink, updateLink } from "~/app/edit/actions"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import type { linkTable } from "~/db/schema"

export function EditLinkForm({
	link,
	trigger,
	isOpen: controlledIsOpen,
	onOpenChange,
	categoryId
}: {
	link?: typeof linkTable.$inferSelect
	trigger?: React.ReactNode
	isOpen?: boolean
	onOpenChange?: (open: boolean) => void
	categoryId?: string
}) {
	const [internalIsOpen, setInternalIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const isOpen =
		controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
	const setIsOpen = onOpenChange || setInternalIsOpen

	const isEditMode = !!link

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true)
		if (isEditMode) {
			formData.append("id", link.id)
			await updateLink(formData)
		} else {
			if (categoryId) {
				formData.append("categoryId", categoryId)
			}
			await createLink(formData)
		}
		setIsOpen(false)
		setIsLoading(false)
	}

	const defaultTrigger = (
		<Card className="w-full aspect-video border-dashed cursor-pointer hover:bg-muted/50 transition-colors flex justify-center items-center">
			<div className="text-center">
				<div className="text-6xl text-muted-foreground mb-4">+</div>
				<div className="text-muted-foreground font-medium">Add New Link</div>
			</div>
		</Card>
	)

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{(trigger || !isEditMode) && (
				<DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
			)}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEditMode ? "Edit Link" : "Add New Link"}</DialogTitle>
				</DialogHeader>
				<form action={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="name" className="text-sm font-medium">
							Name <span className="text-red-500">*</span>
						</label>
						<Input
							id="name"
							name="name"
							defaultValue={link?.name || ""}
							placeholder="Enter item name"
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
							defaultValue={link?.url || ""}
							placeholder="https://example.com"
							required
						/>
					</div>
					<div>
						<label htmlFor="file" className="text-sm font-medium">
							{isEditMode ? "Replace Background (optional)" : "Background"}
						</label>
						<Input id="file" name="file" type="file" accept="image/*" />
						{isEditMode && link?.filename && (
							<p className="text-xs text-muted-foreground mt-1">
								Current: {link.filename}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="description" className="text-sm font-medium">
							Description
						</label>
						<Textarea
							id="description"
							name="description"
							defaultValue={link?.description || ""}
							placeholder="Optional description"
							rows={3}
						/>
					</div>
					<div className="flex gap-2">
						<Button type="submit" className="flex-1">
							{isLoading ? (
								<Loader2Icon className="animate-spin size-6" />
							) : isEditMode ? (
								"Save Changes"
							) : (
								"Create Link"
							)}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
