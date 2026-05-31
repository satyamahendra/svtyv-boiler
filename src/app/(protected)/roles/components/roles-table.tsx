import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {getRoles} from "../services/get-roles"
import PaginationParams from "@/components/custom/pagination-params"
import {PiCardholder} from "react-icons/pi"
import {Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia} from "@/components/ui/empty"
import RoleItem from "./role-item"
import AnimDiv from "@/components/custom/anim-div"

type Props = {
    page?: number
    search?: string
}

export async function RolesTable({page, search}: Props) {
    const data = await getRoles(page, search)

    return (
        <AnimDiv className="flex flex-col gap-4">
            {data.roles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiCardholder />
                            </EmptyMedia>
                            <EmptyTitle>No roles found</EmptyTitle>
                            <EmptyDescription>There are currently no roles available.</EmptyDescription>
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
                                <TableHead className="font-semibold">Permissions</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.roles.map((role, index) => (
                                <RoleItem key={role.name} role={role} number={index + 1 + (data.pagination.page - 1) * 10} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <div className="ml-auto">
                <PaginationParams className="w-fit" pageCount={data.pagination.pageCount} />
            </div>
        </AnimDiv>
    )
}
