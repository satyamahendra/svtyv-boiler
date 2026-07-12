"use client"

import {Button} from "@/components/ui/button"
import {PiCircle, PiCircleFill, PiPencil} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item"
import {GetRole} from "../services/get-roles"

type RoleItemProps = {
    role: GetRole
}

const RoleItem = ({role}: RoleItemProps) => {
    const {setParams} = useQueryParams()

    const firstThreePermissions = role.permissions.slice(0, 3)
    const hasMore = role.permissions.length > 3
    const restPermissions = role.permissions.slice(3)

    return (
        <Item className="bg-muted hover:bg-background duration-200">
            <ItemMedia variant="icon"></ItemMedia>
            {role.is_active ? (
                <div className="text-green-500 flex items-center gap-1">
                    <PiCircleFill className="text-lg" />
                </div>
            ) : (
                <div className="text-muted-foreground flex items-center gap-1">
                    <PiCircle className="text-lg" />
                </div>
            )}
            <ItemContent>
                <ItemTitle>{role.name}</ItemTitle>
                <ItemDescription className="space-x-2">
                    {firstThreePermissions.map((p) => (
                        <Badge variant={"outline"} className="text-muted-foreground" key={p.permission_name}>
                            {p.permission_name}
                        </Badge>
                    ))}
                    {hasMore && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant={"outline"} className="text-muted-foreground">
                                    +{restPermissions.length} more
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="flex flex-col gap-1">
                                    {restPermissions.map((p) => (
                                        <span key={p.permission_name}>{p.permission_name}</span>
                                    ))}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button className="rounded-lg" onClick={() => setParams({view: role.name})} size={"icon-sm"} variant="outline">
                    <PiPencil />
                </Button>
                <DeleteButton role={role} />
            </ItemActions>
        </Item>
    )
}

export default RoleItem
