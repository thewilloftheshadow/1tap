"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

interface AuthGuardProps {
	children: React.ReactNode
	authenticateAction: (password: string) => Promise<boolean>
}

export function AuthGuard({ children, authenticateAction }: AuthGuardProps) {
	const [password, setPassword] = useState("")
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError("")

		try {
			const isValid = await authenticateAction(password)
			if (isValid) {
				setIsAuthenticated(true)
			} else {
				setError("Invalid password")
				setPassword("")
			}
		} catch {
			setError("Authentication failed")
			setPassword("")
		} finally {
			setIsLoading(false)
		}
	}

	if (isAuthenticated) {
		return <>{children}</>
	}

	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<div className="w-full max-w-sm space-y-6">
				<div className="text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Authentication Required
					</h1>
					<p className="text-sm text-muted-foreground mt-2">
						Please enter the password to access the edit panel
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Input
							type="password"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={error ? "border-destructive" : ""}
							disabled={isLoading}
							autoFocus
						/>
						{error && <p className="text-sm text-destructive">{error}</p>}
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isLoading || !password.trim()}
					>
						{isLoading ? "Authenticating..." : "Enter"}
					</Button>
				</form>
			</div>
		</div>
	)
}
