import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {Suspense} from "react"
import {PiCardholder} from "react-icons/pi"
import {RolesTable} from "./components/roles-table"
import {Loader2} from "lucide-react"
import RoleFormModal from "./components/role-form-modal"

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
            <PageHeader title="Roles" description="Manage roles" icon={<PiCardholder />} subComponent={<RoleFormModal />} />
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-20">
                        <span className="text-muted-foreground">
                            <Loader2 className="animate-spin text-primary" />
                        </span>
                    </div>
                }>
                <RolesTable page={pageNum} />
            </Suspense>
        </div>
    )
}

export default Page
