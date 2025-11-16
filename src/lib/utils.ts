import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function titleCase(str: string) {
	return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

export function formatDate(date: Date) {
	return `${date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric"
	})} ${date.toLocaleTimeString("en-US", {
		hour: `2-digit`,
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	})}`
}
