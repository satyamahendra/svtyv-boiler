"use client"

import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item"
import {signInSocial} from "../services/signin.service"
import {FcGoogle} from "react-icons/fc"
import {toast} from "sonner"
import {useMutation} from "@tanstack/react-query"
import {useRouter} from "next/navigation"

const GoogleItem = () => {
    const router = useRouter()
    const {mutate, isPending} = useMutation({
        mutationFn: signInSocial,
        onSuccess: () => {
            toast.success("Signed in successfully!")
            router.push("/")
        },
        onError: (data) => {
            toast.error("Failed to sign in. Please try again.")
        },
    })

    return (
        <Item variant="muted" className="hover:cursor-pointer" onClick={() => mutate()} aria-disabled={isPending}>
            <ItemMedia variant="icon">
                <FcGoogle className="text-2xl" />
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{isPending ? "Signing in..." : "Sign in with Google"}</ItemTitle>
            </ItemContent>
        </Item>
    )
}

export default GoogleItem
