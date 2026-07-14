"use client"

import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {GetProduct} from "../services/get-products"
import {PiCube, PiPackage, PiPencil} from "react-icons/pi"
import {Separator} from "@/components/ui/separator"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {Button} from "@/components/ui/button"

type ProductItemProps = {
    product: GetProduct
}

const ProductItem = ({product}: ProductItemProps) => {
    const {setParams} = useQueryParams()
    const isActive = product.is_active

    return (
        <div className={`bg-muted/50 hover:bg-muted duration-200 p-2 border border-l-6 ${isActive ? "border-l-primary" : "border-l-muted-/50"} rounded-md`}>
            <div className="flex gap-2 ml-2">
                <div>
                    <div>{product.name}</div>
                    <div className="flex gap-2 text-muted-foreground text-sm">
                        <span className="flex items-center font-bold gap-2">Rp. {product.price_actual}</span>
                        <Separator orientation="vertical" />
                        <span className="flex items-center gap-1">
                            <PiCube className="text-sm" />
                            {normalizeString(product.type)}
                        </span>
                        <Separator orientation="vertical" />
                        <span className="flex items-center gap-1">
                            <PiPackage className="text-sm" />
                            {product?.bundle_items?.length}
                        </span>
                    </div>
                </div>
                <div className="ml-auto">
                    <Button className="rounded-lg" onClick={() => setParams({view: product.id})} size={"icon-sm"} variant="outline">
                        <PiPencil />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductItem
