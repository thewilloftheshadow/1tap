import fs from "node:fs"
import path from "node:path"
import {fileTypeFromFile} from 'file-type';

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ name: string }> }
) {
	const { name } = await params
	const filePath = path.join(process.cwd(), "uploads", name)
	const contentType = await fileTypeFromFile(filePath)
	return new Response(fs.readFileSync(filePath), {
		headers: contentType ? {
			"Content-Type": contentType.mime
		} : {}
	})
}
