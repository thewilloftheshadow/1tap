import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function titleCase(str: string) {
	return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}
