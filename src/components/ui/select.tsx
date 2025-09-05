"use client"

import { ChevronDownIcon } from "lucide-react"
import * as React from "react"
import { cn } from "~/lib/utils"

const Select = React.forwardRef<
	HTMLSelectElement,
	React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
	return (
		<div className="relative">
			<select
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8",
					className
				)}
				ref={ref}
				{...props}
			>
				{children}
			</select>
			<ChevronDownIcon className="absolute right-2 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
		</div>
	)
})
Select.displayName = "Select"

export { Select }
