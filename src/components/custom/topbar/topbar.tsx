"use client"

import {Button} from "@/components/ui/button"
import {authClient} from "@/lib/auth-client"
import {useTheme} from "next-themes"
import {PiCalendarDots, PiCircleDashed, PiMoon, PiPower, PiSun} from "react-icons/pi"
import {useState, useEffect} from "react" // 1. Import useEffect
import {toast} from "sonner"
import {redirect} from "next/navigation"
import {format} from "date-fns"

const Topbar = () => {
    const {setTheme, theme} = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false) // 2. Track mounting status

    // 3. Set mounted to true after the component loads on the browser
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
        <header className="flex items-center justify-between w-full">
            <div className="flex gap-2 items-center text-sm font-light text-muted-foreground">
                <PiCalendarDots size={18} />
                {format(new Date(), "EEEE, MMMM d, yyyy")}
            </div>
            <ul className="flex gap-2">
                <li>
                    <Button
                        onClick={() => {
                            setTheme(theme === "dark" ? "light" : "dark")
                        }}
                        variant={"outline"}
                        className="rounded-lg cursor-pointer"
                        size="icon-sm">
                        {!mounted ? <div className="w-[18px] h-[18px]" /> : theme === "dark" ? <PiMoon /> : <PiSun />}
                    </Button>
                </li>
                <li>
                    <Button onClick={handleLogout} disabled={isLoading} variant={"outline"} className="rounded-lg cursor-pointer" size="icon-sm">
                        {isLoading ? <PiCircleDashed className="animate-spin" /> : <PiPower />}
                    </Button>
                </li>
            </ul>
        </header>
    )
}

export default Topbar
