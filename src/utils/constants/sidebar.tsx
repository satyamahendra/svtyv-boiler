import {PiCardholder, PiCreditCard, PiHouse, PiKey, PiUser} from "react-icons/pi"

export type MenuItem = (typeof menuItems)[number]

export const menuItems = [
    {
        label: "Home",
        href: "/home",
        icon: <PiHouse />,
        children: [],
    },
    {
        label: "Admin",
        href: "/admin",
        icon: <PiCreditCard />,
        children: [
            {
                label: "Permissions",
                href: "/permissions",
                icon: <PiKey />,
                children: [],
            },
            {
                label: "Roles",
                href: "/roles",
                icon: <PiCardholder />,
                children: [],
            },
            {
                label: "Users",
                href: "/users",
                icon: <PiUser />,
                children: [],
            },
        ],
    },
]
