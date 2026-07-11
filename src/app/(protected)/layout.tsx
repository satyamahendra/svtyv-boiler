import Sidebar from "@/components/custom/sidebar/sidebar"
import Topbar from "@/components/custom/topbar/topbar"
import {authServer} from "@/lib/auth-server"
import {redirect} from "next/navigation"

type LayoutProps = {
    children: React.ReactNode
}

const Layout = async ({children}: LayoutProps) => {
    const session = await authServer()

    if (!session) {
        return redirect(`/auth`)
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col items-center gap-4 p-4 w-full h-full">
                <Topbar />
                <div className="max-w-[650px] w-full flex-1 min-h-0">{children}</div>
            </div>
        </div>
    )
}

export default Layout
