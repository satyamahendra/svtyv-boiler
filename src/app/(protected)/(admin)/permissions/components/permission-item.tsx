"use client"

import {Button} from "@/components/ui/button"
import {PiPencil} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"
import {GetPermission} from "../services/get-permissions"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"

type PermissionItemProps = {
    permission: GetPermission
}

const PermissionItem = ({permission}: PermissionItemProps) => {
    const {setParams} = useQueryParams()

    const firstThreeRoles = permission.roles.slice(0, 2)
    const hasMore = permission.roles.length > 2
    const restRoles = permission.roles.slice(2)
    const isActive = permission.is_active

    return (
        <div className={`bg-muted/50 hover:bg-muted duration-200 p-2 border border-l-6 ${isActive ? "border-l-primary" : "border-l-muted-/50"} rounded-md`}>
            <div className="flex gap-2 ml-2">
                <div>
                    <div>{permission.name}</div>
                    <div className="space-x-1 mt-1">
                        {firstThreeRoles.map((r) => (
                            <Badge variant={"outline"} className="text-muted-foreground" key={r.role_name}>
                                {r.role_name}
                            </Badge>
                        ))}
                        {hasMore && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant={"outline"} className="text-muted-foreground">
                                        +{restRoles.length} more
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="flex flex-col gap-1">
                                        {restRoles.map((r) => (
                                            <span key={r.role_name}>{r.role_name}</span>
                                        ))}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <DeleteButton permission={permission} />
                    <Button className="rounded-lg" onClick={() => setParams({view: permission.name})} size={"icon-sm"} variant="outline">
                        <PiPencil />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PermissionItem
