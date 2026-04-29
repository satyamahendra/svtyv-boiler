import Link from "next/link"
import {usePathname} from "next/navigation"
import {useState, useEffect} from "react"
import {ChevronDown} from "lucide-react"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import {cn} from "@/lib/utils"
import {hasAccess, MenuItem} from "@/utils/constants/sidebar"
import {PiCaretDown} from "react-icons/pi"

const SidebarItem = ({menu, userPermissions, userRoles}: {menu: MenuItem; userPermissions: string[]; userRoles: string[]}) => {
    const pathname = usePathname()

    const accessibleChildren = menu.children.filter((child) => hasAccess(child, userPermissions, userRoles))

    const hasChildren = accessibleChildren.length > 0
    const isActive = pathname === menu.href || (menu.href !== "/" && menu.href !== "" && pathname.startsWith(menu.href + "/"))
    const isChildActive = accessibleChildren.some((child) => pathname === child.href || (child.href !== "/" && child.href !== "" && pathname.startsWith(child.href + "/")))

    const [open, setOpen] = useState(isChildActive)

    useEffect(() => {
        if (isChildActive) {
            setOpen(true)
        }
    }, [pathname, isChildActive])

    const linkClass = cn(
        "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors",
        "hover:bg-primary hover:text-primary-foreground",
        isActive && "bg-primary text-primary-foreground font-medium"
    )

    if (!hasChildren) {
        return (
            <li>
                <Link href={menu.href} className={linkClass}>
                    <span className="text-lg shrink-0">{menu.icon}</span>
                    <span>{menu.label}</span>
                </Link>
            </li>
        )
    }

    return (
        <li>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <button className={cn(linkClass, "w-full justify-between", isChildActive && "text-accent-foreground font-medium")}>
                        <span className="flex items-center gap-3">
                            <span className="text-lg shrink-0">{menu.icon}</span>
                            <span>{menu.label}</span>
                        </span>
                        <PiCaretDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", open && "rotate-180")} />
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <ul className="ml-4 mt-1 flex flex-col gap-1 border-l pl-3">
                        {accessibleChildren.map((child) => (
                            <SidebarItem key={child.label} menu={child} userPermissions={userPermissions} userRoles={userRoles} />
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    )
}

export default SidebarItem
