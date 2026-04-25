"use client"

import {menuItems} from "@/utils/constants/sidebar"
import SidebarItem from "./sidebar-item"

const Sidebar = () => {
    return (
        <aside className="h-screen top-0 left-0 p-4">
            <div className="bg-sidebar border p-4 rounded-lg w-[200px] h-full flex flex-col">
                <h1 className="text-xl tracking-tighter text-center">svtyv</h1>
                <ul className="flex flex-col gap-1 mt-4">
                    {menuItems.map((item) => (
                        <SidebarItem key={item.label} item={item} />
                    ))}
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar
