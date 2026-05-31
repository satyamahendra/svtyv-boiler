import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {Suspense} from "react"
import {PiKey} from "react-icons/pi"
import {PermissionsTable} from "./components/permissions-table"
import {Loader2} from "lucide-react"
import PermissionFormModal from "./components/permission-form-modal"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import SearchParams from "@/components/custom/search-params"

type PageProps = {
    searchParams: Promise<{
        page?: string
        search?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const hasPerm = await hasPermissions(["read permissions"])
    if (!hasPerm) return redirect("/home")

    const {page, search} = await searchParams
    const pageNum = page ? parseInt(page) : 1

    return (
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader title="Permissions" description="Manage permissions" icon={<PiKey />} subComponent={<PermissionFormModal />} />
            <SearchParams className="w-48 self-end" />
            <Suspense
                key={`${page}-${search}`}
                fallback={
                    <AnimDiv className="flex items-center justify-center h-20">
                        <span className="text-muted-foreground">
                            <Loader2 className="animate-spin text-primary" />
                        </span>
                    </AnimDiv>
                }>
                <PermissionsTable page={pageNum} search={search} />
            </Suspense>
        </AnimDiv>
    )
}

export default Page
