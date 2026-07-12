"use client"

import {Button} from "@/components/ui/button"
import {PiCircle, PiCircleFill, PiPencil} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"
import {GetPermission} from "../services/get-permissions"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item"

type PermissionItemProps = {
    permission: GetPermission
}

const PermissionItem = ({permission}: PermissionItemProps) => {
    const {setParams} = useQueryParams()

    const firstThreeRoles = permission.roles.slice(0, 3)
    const hasMore = permission.roles.length > 3
    const restRoles = permission.roles.slice(3)

    return (
        <Item className="bg-muted hover:bg-background duration-200">
            <ItemMedia variant="icon"></ItemMedia>
            {permission.is_active ? (
                <div className="text-green-500 flex items-center gap-1">
                    <PiCircleFill className="text-lg" />
                </div>
            ) : (
                <div className="text-muted-foreground flex items-center gap-1">
                    <PiCircle className="text-lg" />
                </div>
            )}
            <ItemContent>
                <ItemTitle>{permission.name}</ItemTitle>
                <ItemDescription className="space-x-2">
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
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button className="rounded-lg" onClick={() => setParams({view: permission.name})} size={"icon-sm"} variant="outline">
                    <PiPencil />
                </Button>
                <DeleteButton permission={permission} />
            </ItemActions>
        </Item>
    )
}

export default PermissionItem
