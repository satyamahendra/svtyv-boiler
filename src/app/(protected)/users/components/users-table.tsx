import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {getUsers} from "../services/get-users"
import PaginationParams from "@/components/custom/pagination-params"
import {Button} from "@/components/ui/button"
import {PiCaretRight} from "react-icons/pi"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {PiUser} from "react-icons/pi"
import {Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia} from "@/components/ui/empty"

type Props = {
    page: number
}

export async function UsersTable({page}: Props) {
    try {
        const data = await getUsers(page)

        return (
            <div className="flex flex-col gap-4">
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
                                    <TableHead className="font-semibold">Created</TableHead>
                                    <TableHead className="font-semibold">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.users.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{index + 1 + (data.pagination.page - 1) * 10}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Avatar className="w-7 h-7">
                                                <AvatarImage src={user.image || ""} />
                                                <AvatarFallback>{user.name ? user.name[0].toUpperCase() : "U"}</AvatarFallback>
                                            </Avatar>
                                            <div>{user.name ?? "-"}</div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button size={"sm"} variant="outline">
                                                Detail <PiCaretRight />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {data.pagination.pageCount > 1 && (
                    <PaginationParams pageCount={data.pagination.pageCount} />
                )}
            </div>
        )
    } catch (error) {
        return (
            <div className="flex items-center justify-center h-20">
                <span className="text-muted-foreground">Failed to load users.</span>
            </div>
        )
    }
}
