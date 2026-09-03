"use client"

import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {PiPencil} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import ListItem from "@/components/custom/item"
import {CRUD_ACTIONS} from "../../roles/utils/permission-matrix"
import {PermissionRow} from "./permission-list"
import {cn} from "@/lib/utils"

type PermissionItemProps = {
    row: PermissionRow
}

const PermissionItem = ({row}: PermissionItemProps) => {
    const {setParams} = useQueryParams()

    return (
        <ListItem
            title={row.attribute}
            description={
                <div className="flex flex-wrap items-center gap-1">
                    {!row.isOther &&
                        CRUD_ACTIONS.map((action) => (
                            <Badge
                                key={action}
                                variant={row.byAction[action] ? "default" : "outline"}
                                className={cn("capitalize", !row.byAction[action] && "text-muted-foreground")}>
                                {action}
                            </Badge>
                        ))}
                </div>
            }
            actions={
                <Button className="rounded-lg" onClick={() => setParams({view: row.attribute})} size={"icon-sm"} variant="outline">
                    <PiPencil />
                </Button>
            }
        />
    )
}

export default PermissionItem
