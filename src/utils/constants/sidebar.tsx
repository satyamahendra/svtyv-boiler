import {PiCardholder, PiCreditCard, PiHouse, PiKey, PiRobot, PiUser} from "react-icons/pi"

export interface MenuItem {
    label: string
    href: string
    icon: React.ReactNode
    permissions: string[]
    roles: string[]
    children: MenuItem[]
}

export function hasAccess(item: MenuItem, userPermissions: string[], userRoles: string[]): boolean {
    const matchesDirect = item.permissions.length === 0 || item.permissions.some((p) => userPermissions.includes(p))

    if (item.children.length > 0) {
        return item.children.some((child) => hasAccess(child, userPermissions, userRoles))
    }

    return matchesDirect
}

export const menuItems = [
    {
        label: "Home",
        href: "/home",
        icon: <PiHouse />,
        permissions: [],
        roles: [],
        children: [],
    },
    {
        label: "Test",
        href: "/test",
        icon: <PiRobot />,
        permissions: [],
        roles: [],
        children: [
            {
                label: "Test 1",
                href: "/test",
                icon: <PiRobot />,
                permissions: ["read test"],
                roles: [],
                children: [],
            },
            {
                label: "Test 2",
                href: "/test2",
                icon: <PiRobot />,
                permissions: ["read test 2"],
                roles: [],
                children: [],
            },
        ],
    },
    {
        label: "Admin",
        href: "/admin",
        icon: <PiCreditCard />,
        permissions: [],
        roles: [],
        children: [
            {
                label: "Permissions",
                href: "/permissions",
                icon: <PiKey />,
                permissions: [],
                roles: [],
                children: [],
            },
            {
                label: "Roles",
                href: "/roles",
                icon: <PiCardholder />,
                permissions: [],
                roles: [],
                children: [],
            },
            {
                label: "Users",
                href: "/users",
                icon: <PiUser />,
                permissions: [],
                roles: [],
                children: [],
            },
        ],
    },
]
