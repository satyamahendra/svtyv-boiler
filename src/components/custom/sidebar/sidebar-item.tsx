import Link from "next/link"
import {usePathname} from "next/navigation"
import {useState} from "react"
import {ChevronDown} from "lucide-react"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import {cn} from "@/lib/utils"
import {MenuItem} from "@/utils/constants/sidebar"

const SidebarItem = ({item}: {item: MenuItem}) => {
    const pathname = usePathname()
    const hasChildren = item.children.length > 0
    const isActive = pathname === item.href
    const isChildActive = item.children.some((child) => pathname === child.href)

    const [open, setOpen] = useState(isChildActive)

    const linkClass = cn(
        "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground font-medium"
    )

    if (!hasChildren) {
        return (
            <li>
                <Link href={item.href} className={linkClass}>
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
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
                            <span className="text-lg shrink-0">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <ul className="ml-4 mt-1 flex flex-col gap-1 border-l pl-3">
                        {item.children.map((child) => (
                            <SidebarItem key={child.label} item={child} />
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    )
}

export default SidebarItem
