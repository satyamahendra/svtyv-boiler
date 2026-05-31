import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {getUsers} from "../services/get-users"
import PaginationParams from "@/components/custom/pagination-params"
import {PiUser} from "react-icons/pi"
import {Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia} from "@/components/ui/empty"
import UserItem from "./user-item"
import AnimDiv from "@/components/custom/anim-div"

type Props = {
    page?: number
    search?: string
}

export async function UsersTable({page, search}: Props) {
    const data = await getUsers(page, search)

    return (
        <AnimDiv className="flex flex-col gap-4">
            {data.users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiUser />
                            </EmptyMedia>
                            <EmptyTitle>No users found</EmptyTitle>
                            <EmptyDescription>There are currently no users available.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="font-semibold">#</TableHead>
                                <TableHead className="font-semibold">Name</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Date Created</TableHead>
                                <TableHead className="font-semibold">Roles</TableHead>
                                <TableHead className="font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.users.map((user, index) => (
                                <UserItem key={user.id} user={user} number={index + 1 + (data.pagination.page - 1) * 10} />
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
