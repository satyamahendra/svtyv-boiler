import {getOrders} from "../services/get-orders"
import {PiTicket} from "react-icons/pi"
import OrderItem from "./order-item"
import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import PaginationParams from "@/components/custom/pagination-params"

type OrderListProps = {
    page?: number
    search?: string
}

const OrderList = async ({page, search}: OrderListProps) => {
    const data = await getOrders(page, search)

    if (!data.success) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PiTicket />
                    </EmptyMedia>
                    <EmptyTitle>Something Went Wrong</EmptyTitle>
                    <EmptyDescription>{data?.message}, Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <AnimDiv className="flex flex-col gap-4">
            {data.data && data.data?.orders.length > 0 ? (
                <div className="flex flex-col overflow-hidden">
                    {data.data.orders.map((order) => (
                        <OrderItem key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiTicket />
                            </EmptyMedia>
                            <EmptyTitle>No Orders Found</EmptyTitle>
                            <EmptyDescription>There are no orders found</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            )}
            <div className="ml-auto">
                <PaginationParams className="w-fit" pageCount={data.data?.pagination.pageCount ?? 1} />
            </div>
        </AnimDiv>
    )
}

export default OrderList
