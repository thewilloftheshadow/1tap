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
	sortableKeyboardCoordinates
} from "@dnd-kit/sortable"
import { useEffect, useState } from "react"
import {
	createCategory,
	getCategories,
	getLinksByCategory,
	reorderLinks
} from "~/app/edit/actions"
import { EditLinkCard } from "~/app/edit/EditLinkCard"
import { EditLinkForm } from "~/app/edit/EditLinkForm"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select } from "~/components/ui/select"
import type { linkTable } from "~/db/schema"

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
				setCategories((prev) => [...prev, newCategory])
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

				const updatedLinks = await getLinksByCategory(selectedCategoryId)
				setLinks(updatedLinks)
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

					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<SortableContext
								items={links.map((link) => link.id)}
								strategy={rectSortingStrategy}
							>
								{links.map((link) => (
									<EditLinkCard key={link.id} link={link} />
								))}
							</SortableContext>
							<EditLinkForm categoryId={selectedCategoryId} />
						</div>
					</DndContext>
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
