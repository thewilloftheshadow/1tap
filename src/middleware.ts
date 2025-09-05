import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Add pathname to headers so server components can access it
	const requestHeaders = new Headers(request.headers)
	requestHeaders.set("x-current-path", pathname)

	return NextResponse.next({
		request: {
			headers: requestHeaders
		}
	})
}
