import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {getPermissions} from "../services/get-permissions"
import PaginationParams from "@/components/custom/pagination-params"
import {PiKey} from "react-icons/pi"
import {Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia} from "@/components/ui/empty"
import PermissionItem from "./permission-item"

type Props = {
    page: number
}

export async function PermissionsTable({page}: Props) {
    const data = await getPermissions(page)

    return (
        <div className="flex flex-col gap-4">
            {data.permissions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiKey />
                            </EmptyMedia>
                            <EmptyTitle>No permissions found</EmptyTitle>
                            <EmptyDescription>There are currently no permissions available.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="font-semibold w-[80px]">#</TableHead>
                                <TableHead className="font-semibold">Name</TableHead>
                                <TableHead className="font-semibold">Roles</TableHead>
                                <TableHead className="font-semibold text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.permissions.map((permission, index) => (
                                <PermissionItem key={permission.name} permission={permission} number={index + 1 + (data.pagination.page - 1) * 10} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {data.pagination.pageCount > 1 && <PaginationParams pageCount={data.pagination.pageCount} />}
        </div>
    )
}
