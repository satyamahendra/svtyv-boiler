"use client"

import {Button} from "@/components/ui/button"
import {authClient} from "@/lib/auth-client"

export default function Home() {
    const {data: session} = authClient.useSession()

    const singIn = async () => {
        const res = await authClient.signIn.social({
            provider: "google",
        })
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <Button type="submit" onClick={singIn}>
                Sign in google
            </Button>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Looking for a starting point or more instructions? Head over to{" "}
                <a
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    className="font-medium text-zinc-950 dark:text-zinc-50">
                    Templates
                </a>{" "}
                or the{" "}
                <a
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    className="font-medium text-zinc-950 dark:text-zinc-50">
                    Learning
                </a>{" "}
                center.
            </p>
        </div>
    )
}
