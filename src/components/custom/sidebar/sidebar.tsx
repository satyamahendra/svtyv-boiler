"use client"

import {hasAccess, menuItems} from "@/utils/constants/sidebar"
import SidebarItem from "./sidebar-item"
import {authClient} from "@/lib/auth-client"
import {useState} from "react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {PiCaretLeft} from "react-icons/pi"

const Sidebar = () => {
    const {data: session} = authClient.useSession()

    const userPermissions = session?.user?.permissions ?? []
    const userRoles = session?.user?.roles ?? []

    const [isExpand, setIsExpand] = useState(false)

    const handleToggleExpand = () => {
        setIsExpand((prev) => !prev)
    }

    return (
        <aside className={cn("h-screen relative top-0 left-0 p-4 transition-all duration-300 ease-in-out", isExpand ? "w-64" : "w-[100px]")}>
            <div className="bg-sidebar border p-4 rounded-lg h-full flex flex-col overflow-hidden">
                <Button variant={"secondary"} onClick={handleToggleExpand} size="icon-xs" className="absolute right-1 top-8 shrink-0">
                    <PiCaretLeft className={cn("transition-transform duration-300", !isExpand && "rotate-180")} />
                </Button>
                <ul className="flex flex-col gap-1">
                    {menuItems
                        .filter((menu) => hasAccess(menu, userPermissions, userRoles))
                        .map((menu) => (
                            <SidebarItem key={menu.label} menu={menu} userPermissions={userPermissions} userRoles={userRoles} isExpand={isExpand} />
                        ))}
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar
