"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import { deleteLink, toggleLinkActive } from "~/app/edit/actions"
import { EditLinkForm } from "~/app/edit/EditLinkForm"
import { LinkCard } from "~/components/LinkCard"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import type { linkTable } from "~/db/schema"

export function EditLinkCard({
	link
}: {
	link: typeof linkTable.$inferSelect
}) {
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isActive, setIsActive] = useState(link.active)

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id: link.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	}

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

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="relative cursor-grab active:cursor-grabbing"
			{...attributes}
			{...listeners}
		>
			<LinkCard
				link={link}
				asLink={false}
				className={!isActive ? "opacity-50" : ""}
			>
				<div className="absolute top-2 right-2 flex gap-2 pointer-events-auto">
					<Switch
						checked={isActive}
						onCheckedChange={handleToggleActive}
						className="bg-white/20 backdrop-blur-sm"
					/>
				</div>
			</LinkCard>

			<div className="flex gap-2 mt-2 pointer-events-auto">
				<EditLinkForm
					link={link}
					isOpen={isEditOpen}
					onOpenChange={setIsEditOpen}
					trigger={
						<Button variant="outline" size="sm" className="flex-1">
							Edit
						</Button>
					}
				/>

				<Button variant="destructive" size="sm" onClick={handleDelete}>
					Delete
				</Button>
			</div>
		</div>
	)
}
