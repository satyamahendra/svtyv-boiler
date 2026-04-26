"use client"

import {Role} from "@/generated/index"
import {TableCell, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {PiArrowSquareOut, PiCaretRight, PiTrash} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"

type RoleItemProps = {
    role: Role
    number: number
}

const RoleItem = ({role, number}: RoleItemProps) => {
    const {setParams} = useQueryParams()

    return (
        <TableRow key={role.name}>
            <TableCell>{number}</TableCell>
            <TableCell className="font-medium">{role.name}</TableCell>
            <TableCell className="text-right space-x-2">
                <Button className="rounded-lg" onClick={() => setParams({view: role.name})} size={"icon-sm"} variant="outline">
                    <PiArrowSquareOut />
                </Button>
                <DeleteButton role={role} />
            </TableCell>
        </TableRow>
    )
}

export default RoleItem
