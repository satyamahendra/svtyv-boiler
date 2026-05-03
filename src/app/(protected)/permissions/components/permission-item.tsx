"use client"

import {TableCell, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {PiArrowSquareOut} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"
import {PermissionWithRoles} from "../services/get-permissions"
import {Badge} from "@/components/ui/badge"

type PermissionItemProps = {
    permission: PermissionWithRoles
    number: number
}

const PermissionItem = ({permission, number}: PermissionItemProps) => {
    const {setParams} = useQueryParams()

    return (
        <TableRow key={permission.name}>
            <TableCell>{number}</TableCell>
            <TableCell className="font-medium">{permission.name}</TableCell>
            <TableCell className="font-medium">
                <div className="flex flex-wrap gap-2">
                    {permission.roles.map((r) => (
                        <Badge variant={"outline"} className="text-muted-foreground" key={r.role_name}>
                            {r.role_name}
                        </Badge>
                    ))}
                </div>
            </TableCell>

            <TableCell className="text-right space-x-2">
                <Button className="rounded-lg" onClick={() => setParams({view: permission.name})} size={"icon-sm"} variant="outline">
                    <PiArrowSquareOut />
                </Button>
                <DeleteButton permission={permission} />
            </TableCell>
        </TableRow>
    )
}

export default PermissionItem
