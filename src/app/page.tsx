"use client"

import {Button} from "@/components/ui/button"
import {authClient} from "@/lib/auth-client"
import Link from "next/link"

export default function Home() {
    const handleSignOut = async () => {
        await authClient.signOut()
    }

    return (
        <main className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
            <p className="max-w-md text-lg leading-8 text-foreground mb-2">Welcome to main page!</p>
            <div className="flex gap-2">
                <Link href={"/auth"}>
                    <Button>Login</Button>
                </Link>
                <Button variant={"outline"} onClick={handleSignOut}>
                    Sign Out
                </Button>
            </div>
        </main>
    )
}
