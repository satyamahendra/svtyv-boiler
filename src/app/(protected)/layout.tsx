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
            <div className="flex flex-col items-center w-full bg-background h-full">
                <Topbar />
                <div className="max-w-260 flex w-full flex-1 min-h-0">
                    <Sidebar />
                    <div className="flex-1 border-l p-6">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default Layout
