"use client"

import {hasAccess, menuItems} from "@/utils/constants/sidebar"
import SidebarItem from "./sidebar-item"
import {authClient} from "@/lib/auth-client"
import {useEffect, useState} from "react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {PiCaretLeft, PiHouse} from "react-icons/pi"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer"
import {usePathname} from "next/navigation"
import {format} from "date-fns"

const Sidebar = () => {
    const {data: session} = authClient.useSession()
    const url = usePathname()
    const {isMobile} = useScreenSize()
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    const userPermissions = session?.user?.permissions ?? []
    const userRoles = session?.user?.roles ?? []

    const [isExpand, setIsExpand] = useState(false)

    const handleToggleExpand = () => {
        setIsExpand((prev) => !prev)
    }

    useEffect(() => {
        if (isMobile) {
            setIsOpen(false)
        }
    }, [isMobile, url])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return

    return (
        <>
            {!isMobile ? (
                <aside className={cn("h-screen relative top-0 left-0 p-4 transition-all duration-300 ease-in-out", isExpand ? "w-64" : "w-[75px]")}>
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
            ) : (
                <Drawer direction={"left"} open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
                    <DrawerTrigger asChild className="fixed top-4 left-4">
                        <Button variant={"outline"} className="rounded-lg cursor-pointer" size="icon-sm">
                            <PiHouse />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent aria-describedby="permission-form" className="max-w-[50vw]">
                        <DrawerHeader>
                            <DrawerTitle className="flex items-center gap-4">Svtyv</DrawerTitle>
                            <DrawerDescription className="flex items-center gap-4">Welcome to svtyv</DrawerDescription>
                        </DrawerHeader>
                        <ul className="flex flex-col gap-1 p-4">
                            {menuItems
                                .filter((menu) => hasAccess(menu, userPermissions, userRoles))
                                .map((menu) => (
                                    <SidebarItem key={menu.label} menu={menu} userPermissions={userPermissions} userRoles={userRoles} isExpand={true} />
                                ))}
                        </ul>
                    </DrawerContent>
                </Drawer>
            )}
        </>
    )
}

export default Sidebar
