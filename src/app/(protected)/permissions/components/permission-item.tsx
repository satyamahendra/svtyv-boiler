"use client"

import {Permission} from "@/generated/index"
import {TableCell, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {PiArrowSquareOut, PiCaretRight, PiTrash} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"

type PermissionItemProps = {
    permission: Permission
    number: number
}

const PermissionItem = ({permission, number}: PermissionItemProps) => {
    const {setParams} = useQueryParams()

    return (
        <TableRow key={permission.name}>
            <TableCell>{number}</TableCell>
            <TableCell className="font-medium">{permission.name}</TableCell>
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
