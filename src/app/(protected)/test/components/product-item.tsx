"use client"

import {Button} from "@/components/ui/button"
import {handleClientError} from "@/utils/helpers/handle-client-errors"
import {useMutation} from "@tanstack/react-query"
import axios from "axios"
import {toast} from "sonner"

const ProductItem = () => {
    const {mutate, isPending} = useMutation({
        mutationFn: async (data: any) => await axios.post("/api/midtrans/token", data),
        onSuccess: (data) => {
            window.snap.pay(data.data.token, {
                onSuccess: () => toast.success("Payment successful!"),
                onError: () => toast.error("Something went wrong."),
            })
        },
        onError: (error) => {
            toast.error(handleClientError(error))
        },
    })

    return (
        <div>
            <h1>
                <Button disabled={isPending} onClick={() => mutate({})}>
                    {isPending ? "Loading..." : "Checkout"}
                </Button>
            </h1>
        </div>
    )
}

export default ProductItem
