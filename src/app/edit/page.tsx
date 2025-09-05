import { AuthGuard } from "~/app/edit/AuthGuard"
import { EditPageContent } from "~/app/edit/EditPageContent"
import { verifyPassword } from "./auth"

export default async function EditPage() {
	return (
		<AuthGuard authenticateAction={verifyPassword}>
			<EditPageContent />
		</AuthGuard>
	)
}
