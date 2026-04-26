import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {Suspense} from "react"
import {PiKey} from "react-icons/pi"
import {PermissionsTable} from "./components/permissions-table"
import {Loader2} from "lucide-react"
import PermissionFormModal from "./components/permission-form-modal"

type PageProps = {
    searchParams: Promise<{
        page?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const {page} = await searchParams
    const pageNum = page ? parseInt(page) : 1

    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Permissions" description="Manage permissions" icon={<PiKey />} subComponent={<PermissionFormModal />} />
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-20">
                        <span className="text-muted-foreground">
                            <Loader2 className="animate-spin text-primary" />
                        </span>
                    </div>
                }>
                <PermissionsTable page={pageNum} />
            </Suspense>
        </div>
    )
}

export default Page
