import { LinkPage } from "~/components/LinkPage"

export default async function Page({
	params
}: {
	params: Promise<{ category: string }>
}) {
	const { category } = await params
	return <LinkPage categoryId={category} />
}
