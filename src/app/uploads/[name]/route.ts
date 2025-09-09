import fs from "node:fs"
import path from "node:path"

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ name: string }> }
) {
	const { name } = await params
	const filePath = path.join(process.cwd(), "uploads", name)
	
	const { fileTypeFromFile } = await import('file-type')
	const contentType = await fileTypeFromFile(filePath)
	
	return new Response(fs.readFileSync(filePath), {
		headers: contentType ? {
			"Content-Type": contentType.mime
		} : {}
	})
}
