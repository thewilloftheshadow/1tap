"use client"

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from "@dnd-kit/core"
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import {
	createCategory,
	createLink,
	deleteLink,
	getCategories,
	getLinksByCategory,
	reorderLinks,
	toggleLinkActive,
	updateLink
} from "~/app/edit/actions"
import { LinkCard } from "~/components/LinkCard"
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
import { Select } from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"
import { Textarea } from "~/components/ui/textarea"
import type { linkTable } from "~/db/schema"

function EditLinkForm({
	link,
	trigger,
	isOpen: controlledIsOpen,
	onOpenChange,
	categoryId,
	onSuccess
}: {
	link?: typeof linkTable.$inferSelect
	trigger?: React.ReactNode
	isOpen?: boolean
	onOpenChange?: (open: boolean) => void
	categoryId?: string
	onSuccess?: () => void
}) {
	const [internalIsOpen, setInternalIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const isOpen =
		controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
	const setIsOpen = onOpenChange || setInternalIsOpen

	const isEditMode = !!link

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true)
		try {
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
			onSuccess?.()
		} finally {
			setIsLoading(false)
		}
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
						<Button type="submit" className="flex-1" disabled={isLoading}>
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
							disabled={isLoading}
						>
							Cancel
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

function EditLinkCard({
	link,
	onSuccess
}: {
	link: typeof linkTable.$inferSelect
	onSuccess?: () => void
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
		onSuccess?.()
	}

	const handleDelete = async () => {
		if (
			confirm(
				"Are you sure you want to delete this link?\n\nThis will permanently delete the link and ALL its analytics data (click tracking). If you want to keep the analytics data, consider disabling the link instead by turning off the toggle."
			)
		) {
			await deleteLink(link.id)
			onSuccess?.()
		}
	}

	return (
		<div className="relative">
			<div
				ref={setNodeRef}
				style={style}
				className="cursor-grab active:cursor-grabbing"
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
			</div>

			<div className="flex gap-2 mt-2">
				<EditLinkForm
					link={link}
					isOpen={isEditOpen}
					onOpenChange={setIsEditOpen}
					onSuccess={onSuccess}
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

export function EditPageContent() {
	const [categories, setCategories] = useState<Array<{ id: string }>>([])
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
	const [links, setLinks] = useState<Array<typeof linkTable.$inferSelect>>([])
	const [newCategoryName, setNewCategoryName] = useState("")
	const [isCreatingCategory, setIsCreatingCategory] = useState(false)
	const [categoryError, setCategoryError] = useState<string | null>(null)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	const refreshCategories = async () => {
		const categoriesData = await getCategories()
		setCategories(categoriesData)
	}

	const refreshLinks = async () => {
		if (!selectedCategoryId) return
		const linksData = await getLinksByCategory(selectedCategoryId)
		setLinks(linksData)
	}

	useEffect(() => {
		async function loadCategories() {
			const categoriesData = await getCategories()
			setCategories(categoriesData)
			if (categoriesData.length > 0 && !selectedCategoryId) {
				const firstCategory = categoriesData[0]
				if (firstCategory) {
					setSelectedCategoryId(firstCategory.id)
				}
			}
		}
		loadCategories()
	}, [selectedCategoryId])

	useEffect(() => {
		async function loadLinks() {
			if (!selectedCategoryId) return

			const linksData = await getLinksByCategory(selectedCategoryId)
			setLinks(linksData)
		}

		if (selectedCategoryId) {
			loadLinks()
		}
	}, [selectedCategoryId])

	const handleCreateCategory = async () => {
		if (!newCategoryName.trim()) return

		setIsCreatingCategory(true)
		setCategoryError(null)
		try {
			const newCategory = await createCategory(newCategoryName.trim())
			if (newCategory) {
				await refreshCategories()
				setSelectedCategoryId(newCategory.id)
			}
			setNewCategoryName("")
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create category"
			setCategoryError(errorMessage)
		} finally {
			setIsCreatingCategory(false)
		}
	}

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = links.findIndex((link) => link.id === active.id)
			const newIndex = links.findIndex((link) => link.id === over.id)

			if (oldIndex !== -1 && newIndex !== -1) {
				const newLinks = arrayMove(links, oldIndex, newIndex)
				setLinks(newLinks)

				const linkIds = newLinks.map((link) => link.id)
				await reorderLinks(selectedCategoryId, linkIds)

				await refreshLinks()
			}
		}
	}

	const selectedCategory = categories.find(
		(cat) => cat.id === selectedCategoryId
	)

	const formatCategoryName = (id: string) => {
		return id
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ")
	}

	return (
		<div className="w-full max-w-6xl lg:w-[75%] xl:w-[60%] space-y-6 mb-8">
			<div className="space-y-4">
				<div className="flex gap-2 items-end">
					<div className="flex-1">
						<label
							htmlFor="category-select"
							className="text-sm font-medium block mb-2"
						>
							Select Category
						</label>
						<Select
							id="category-select"
							value={selectedCategoryId}
							onChange={(e) => setSelectedCategoryId(e.target.value)}
						>
							<option value="">Select a category...</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{formatCategoryName(category.id)}
								</option>
							))}
						</Select>
					</div>
				</div>

				<div className="flex gap-2 items-end">
					<div className="flex-1">
						<label
							htmlFor="new-category"
							className="text-sm font-medium block mb-2"
						>
							Create New Category
						</label>
						<Input
							id="new-category"
							value={newCategoryName}
							onChange={(e) => {
								setNewCategoryName(e.target.value)
								if (categoryError) setCategoryError(null)
							}}
							placeholder="Enter category name..."
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleCreateCategory()
								}
							}}
						/>
					</div>
					<Button
						onClick={handleCreateCategory}
						disabled={!newCategoryName.trim() || isCreatingCategory}
					>
						{isCreatingCategory ? "Creating..." : "Create"}
					</Button>
				</div>
				{categoryError && (
					<div className="text-red-600 text-sm mt-2">{categoryError}</div>
				)}
			</div>

			{selectedCategoryId && (
				<div>
					<h2 className="text-lg font-semibold mb-4">
						{selectedCategory ? formatCategoryName(selectedCategory.id) : ""}{" "}
						Links
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={links.map((link) => link.id)}
								strategy={rectSortingStrategy}
							>
								{links.map((link) => (
									<EditLinkCard
										key={link.id}
										link={link}
										onSuccess={refreshLinks}
									/>
								))}
							</SortableContext>
						</DndContext>
						<EditLinkForm
							categoryId={selectedCategoryId}
							onSuccess={refreshLinks}
						/>
					</div>
				</div>
			)}

			{!selectedCategoryId && categories.length === 0 && (
				<div className="text-center text-muted-foreground">
					Create your first category to get started.
				</div>
			)}
		</div>
	)
}
