import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import {PiHouse} from "react-icons/pi"
import ProductItem from "./components/product-item"

const Page = async () => {
    const hasPerm = await hasPermissions(["read test"])

    if (!hasPerm) return redirect("/home")

    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Test" description="This is a test page" icon={<PiHouse />} />
            <ProductItem />
        </div>
    )
}

export default Page
