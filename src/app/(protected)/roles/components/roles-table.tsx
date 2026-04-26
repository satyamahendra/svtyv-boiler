import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {getRoles} from "../services/get-roles"
import PaginationParams from "@/components/custom/pagination-params"
import {Button} from "@/components/ui/button"
import {PiCaretRight, PiCardholder} from "react-icons/pi"
import {Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia} from "@/components/ui/empty"
import RoleItem from "./role-item"

type Props = {
    page: number
}

export async function RolesTable({page}: Props) {
    try {
        const data = await getRoles(page)

        return (
            <div className="flex flex-col gap-4">
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

                {data.pagination.pageCount > 1 && <PaginationParams pageCount={data.pagination.pageCount} />}
            </div>
        )
    } catch (error) {
        return (
            <div className="flex items-center justify-center h-20">
                <span className="text-muted-foreground">Failed to load roles.</span>
            </div>
        )
    }
}
