"use client"

import { useState } from "react"
import { createLink } from "~/app/edit/actions"
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

export function EditLinkForm() {
	const [isOpen, setIsOpen] = useState(false)

	const handleCreate = async (formData: FormData) => {
		await createLink(formData)
		setIsOpen(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Card className="w-full aspect-video border-dashed cursor-pointer hover:bg-muted/50 transition-colors flex justify-center items-center">
					<div className="text-center">
						<div className="text-6xl text-muted-foreground mb-4">+</div>
						<div className="text-muted-foreground font-medium">
							Add New Link
						</div>
					</div>
				</Card>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Link</DialogTitle>
				</DialogHeader>
				<form action={handleCreate} className="space-y-4">
					<div>
						<label htmlFor="name" className="text-sm font-medium">
							Name <span className="text-red-500">*</span>
						</label>
						<Input
							id="name"
							name="name"
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
							placeholder="https://example.com"
							required
						/>
					</div>
					<div>
						<label htmlFor="file" className="text-sm font-medium">
							Background
						</label>
						<Input id="file" name="file" type="file" accept="image/*" />
					</div>
					<div>
						<label htmlFor="description" className="text-sm font-medium">
							Description
						</label>
						<Textarea
							id="description"
							name="description"
							placeholder="Optional description"
							rows={3}
						/>
					</div>
					<div className="flex gap-2">
						<Button type="submit" className="flex-1">
							Create Link
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
