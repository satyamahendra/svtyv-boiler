"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {PiPencil} from "react-icons/pi"
import {User} from "../services/get-users"
import {Badge} from "@/components/ui/badge"
import {format} from "date-fns"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import ListItem from "@/components/custom/item"

type Props = {
    user: User
}

const UserItem = ({user}: Props) => {
    const {setParams} = useQueryParams()

    const firstThreeRoles = user.roles.slice(0, 2)
    const hasMore = user.roles.length > 2
    const restRoles = user.roles.slice(2)

    return (
        <ListItem
            media={
                <Avatar className="w-7 h-7 mr-2">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>{user.name ? user.name[0].toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
            }
            title={user.name ?? "-"}
            description={
                <div className="space-x-1">
                    <span className="text-muted-foreground">{user.email}</span>
                    <span className="text-muted-foreground">&middot;</span>
                    <span className="text-muted-foreground">{format(new Date(user.createdAt), "dd MMM yyyy")}</span>
                    <div className="flex gap-1">
                        {firstThreeRoles.map((role) => (
                            <Badge variant={"outline"} className="text-muted-foreground" key={role.role_name}>
                                {role.role_name}
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
            }
            actions={
                <Button className="rounded-lg" onClick={() => setParams({view: user.id})} size={"icon-sm"} variant="outline">
                    <PiPencil />
                </Button>
            }
        />
    )
}

export default UserItem
