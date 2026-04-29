"use client"

import {hasAccess, menuItems} from "@/utils/constants/sidebar"
import SidebarItem from "./sidebar-item"
import {authClient} from "@/lib/auth-client"

const Sidebar = () => {
    const {data: session} = authClient.useSession()

    const userPermissions = session?.user?.permissions ?? []
    const userRoles = session?.user?.roles ?? []

    return (
        <aside className="h-screen top-0 left-0 p-4">
            <div className="bg-sidebar border p-4 rounded-lg w-[200px] h-full flex flex-col">
                <h1 className="text-xl tracking-tighter text-center">svtyv</h1>
                <ul className="flex flex-col gap-1 mt-4">
                    {menuItems
                        .filter((menu) => hasAccess(menu, userPermissions, userRoles))
                        .map((menu) => (
                            <SidebarItem key={menu.label} menu={menu} userPermissions={userPermissions} userRoles={userRoles} />
                        ))}
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar
