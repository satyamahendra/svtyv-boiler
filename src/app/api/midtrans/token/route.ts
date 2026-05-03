import {NextResponse} from "next/server"
import {TokenParameter} from "@/lib/midtrans/types/midtrans"
import {snap} from "@/lib/midtrans/snap"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {authServer} from "@/lib/auth-server"

export async function POST() {
    const parameter: TokenParameter = {
        transaction_details: {
            order_id: "123123",
            gross_amount: 10000,
        },
        credit_card: {
            secure: true,
        },
        item_details: [
            {
                id: "123123",
                price: 10000,
                quantity: 1,
                name: "Baju",
            },
        ],
        customer_details: {
            first_name: "John",
            last_name: "Doe",
            email: "test@gmail.com",
            phone: "08123456789",
        },
    }

    try {
        const session = await authServer()

        if (!session) throw new Error("Unauthorized")

        const data = await snap.createTransaction(parameter)
        return NextResponse.json(data, {status: 200})
    } catch (error) {
        return NextResponse.json(handleServerError(error), {status: 500})
    }
}
