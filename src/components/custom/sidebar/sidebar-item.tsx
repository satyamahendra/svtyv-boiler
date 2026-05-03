"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {useState, useEffect} from "react"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import {cn} from "@/lib/utils"
import {hasAccess, MenuItem} from "@/utils/constants/sidebar"
import {PiCaretDown} from "react-icons/pi"
import {Separator} from "@/components/ui/separator"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"

type SidebarItemProps = {
    menu: MenuItem
    userPermissions: string[]
    userRoles: string[]
    isExpand: boolean
}

const SidebarItem = ({menu, userPermissions, userRoles, isExpand}: SidebarItemProps) => {
    const pathname = usePathname()

    const accessibleChildren = menu.children.filter((child) => hasAccess(child, userPermissions, userRoles))

    const hasChildren = accessibleChildren.length > 0
    const isActive = pathname === menu.href || (menu.href !== "/" && menu.href !== "" && pathname.startsWith(menu.href + "/"))
    const isChildActive = accessibleChildren.some(
        (child) => pathname === child.href || (child.href !== "/" && child.href !== "" && pathname.startsWith(child.href + "/"))
    )

    const [open, setOpen] = useState(isChildActive)

    useEffect(() => {
        if (isChildActive) {
            setOpen(true)
        }
    }, [pathname, isChildActive])

    const linkClass = cn(
        "flex items-center rounded-md px-2 py-2 text-sm transition-colors",
        "hover:bg-primary hover:text-primary-foreground",
        isActive && "bg-primary text-primary-foreground"
    )

    if (!hasChildren) {
        const linkElement = (
            <Link href={menu.href} className={linkClass}>
                <span className="text-lg shrink-0 flex items-center justify-center">{menu.icon}</span>
                <span
                    className={cn(
                        "whitespace-nowrap overflow-hidden transition-all duration-300",
                        isExpand ? "max-w-[200px] opacity-100 ml-3" : "max-w-0 opacity-0 ml-0"
                    )}>
                    {menu.label}
                </span>
            </Link>
        )

        return (
            <li>
                {isExpand ? (
                    linkElement
                ) : (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                        <TooltipContent side="right">{menu.label}</TooltipContent>
                    </Tooltip>
                )}
            </li>
        )
    }

    const triggerElement = (
        <CollapsibleTrigger asChild>
            <button className={cn(linkClass, "w-full justify-between", isChildActive && "text-accent-foreground font-medium")}>
                <span className="flex items-center">
                    <span className="text-lg shrink-0 flex items-center justify-center">{menu.icon}</span>
                    <span
                        className={cn(
                            "whitespace-nowrap overflow-hidden transition-all duration-300",
                            isExpand ? "max-w-[200px] opacity-100 ml-3" : "max-w-0 opacity-0 ml-0"
                        )}>
                        {menu.label}
                    </span>
                </span>
                {isExpand && <PiCaretDown className={cn("shrink-0 ml-auto transition-transform duration-300", open ? "rotate-180" : "rotate-0")} />}
            </button>
        </CollapsibleTrigger>
    )

    return (
        <li>
            <Separator className="mt-1 mb-2" />
            <Collapsible open={open} onOpenChange={setOpen}>
                {isExpand ? (
                    triggerElement
                ) : (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>{triggerElement}</TooltipTrigger>
                        <TooltipContent side="right">{menu.label}</TooltipContent>
                    </Tooltip>
                )}

                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <ul className="mt-1 flex flex-col gap-1">
                        {accessibleChildren.map((child) => (
                            <SidebarItem key={child.label} menu={child} userPermissions={userPermissions} userRoles={userRoles} isExpand={isExpand} />
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    )
}

export default SidebarItem
