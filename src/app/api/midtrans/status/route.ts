import {OrderStatus, Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {snap} from "@/lib/midtrans/snap"
import prisma from "@/lib/prisma/client"
import {apiError, apiSuccess} from "@/utils/types/api-routes"
import {NextRequest, NextResponse} from "next/server"

export async function GET(req: NextRequest): Promise<NextResponse> {
    const midtransOrderIdReq = req.nextUrl.searchParams.get("order_id")

    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const transaction = await snap.transaction.status(midtransOrderIdReq ?? "")

        const transactionStatus = transaction.transaction_status
        const fraudStatus = transaction.fraud_status
        const midtransOrderId = transaction.order_id

        let status = "pending"
        if (transactionStatus == "capture") {
            if (fraudStatus == "challenge") {
                status = "pending"
            } else if (fraudStatus == "accept") {
                status = "success"
            }
        } else if (transactionStatus == "settlement") {
            status = "success"
        } else if (transactionStatus == "deny") {
            status = "deny"
        } else if (transactionStatus == "cancel") {
            status = "cancel"
        } else if (transactionStatus == "expire") {
            status = "expire"
        }

        const order = await prisma.order.findUnique({
            select: {
                id: true,
                midtrans_request: true,
                entitlements: {select: {id: true}},
                user: {select: {id: true}},
            },
            where: {midtrans_order_id: midtransOrderId as string, user_id: session.user.id},
        })

        if (!order) throw new Error("Order not found")

        const midtransRequest = order.midtrans_request as {
            item_details: {id: string; name: string; price: number; quantity: number}[]
        }

        const products = midtransRequest.item_details.map((item) => ({
            ...item,
            id: item.id.includes("bundle_") ? item.id.replace("bundle_", "") : item.id,
        }))

        await prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: {midtrans_order_id: midtransOrderId as string},
                data: {
                    status: status as OrderStatus,
                    midtrans_response: status === "success" ? (transaction as Prisma.InputJsonValue) : Prisma.JsonNull,
                    paid_at: transaction?.settlement_time ? new Date(transaction.settlement_time as string) : null,
                },
            })

            const existingEntitlements = await prisma.entitlement.findFirst({
                where: {order_id: order.id},
            })

            if (!existingEntitlements && status === "success") {
                await tx.entitlement.createMany({
                    data: products.map((p) => ({
                        user_id: order.user.id,
                        product_id: p.id,
                        order_id: order.id,
                    })),
                })
            }
        })

        return apiSuccess(transaction, "Transaction status updated successfully", 200)
    } catch (error) {
        return apiError(error)
    }
}
