"use client"

import {Button} from "@/components/ui/button"
import {authClient} from "@/lib/auth-client"
import {useTheme} from "next-themes"
import {PiCalendarDots, PiCircleDashed, PiMoon, PiSignOut, PiSun} from "react-icons/pi"
import {useState, useEffect} from "react" // 1. Import useEffect
import {toast} from "sonner"
import {redirect} from "next/navigation"
import {format} from "date-fns"
import {useScreenSize} from "@/utils/hooks/useScreenSize"

const Topbar = () => {
    const {setTheme, theme} = useTheme()
    const {isMobile} = useScreenSize()
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = async () => {
        setIsLoading(true)
        const res = await authClient.signOut()
        if (!res?.data?.success) {
            toast.error("Failed to log out")
            setIsLoading(false)
        }
        redirect("/auth")
    }

    return (
        <header className="w-full border-b flex justify-center">
            <div className="max-w-260 w-full flex justify-between px-6 py-2 items-center">
                {mounted && !isMobile && (
                    <div className="flex gap-3 items-center text-lg tracking-tighter font-light">
                        <div className="aspect-square w-3 h-3 rotate-45 rounded-xs bg-primary"></div>
                        svtyv
                    </div>
                )}
                <ul className="flex gap-2 ml-auto">
                    <li>
                        <Button
                            onClick={() => {
                                setTheme(theme === "dark" ? "light" : "dark")
                            }}
                            variant={"outline"}
                            className="rounded-lg cursor-pointer"
                            size="icon-sm">
                            {!mounted ? <div className="w-4.5 h-4.5" /> : theme === "dark" ? <PiMoon /> : <PiSun />}
                        </Button>
                    </li>
                    <li>
                        <Button onClick={handleLogout} disabled={isLoading} variant={"outline"} className="rounded-lg cursor-pointer" size="icon-sm">
                            {isLoading ? <PiCircleDashed className="animate-spin" /> : <PiSignOut />}
                        </Button>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export default Topbar
