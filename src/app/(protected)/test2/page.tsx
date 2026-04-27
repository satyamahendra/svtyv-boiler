import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import {PiHouse} from "react-icons/pi"

const Page = async () => {
    const hasPerm = await hasPermissions(["read test 2"])

    if (!hasPerm) return redirect("/home")

    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Test 2" description="This is a test page" icon={<PiHouse />} />
        </div>
    )
}

export default Page
