import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {PiHouse} from "react-icons/pi"

const Page = () => {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Home" description="Welcome to home page" icon={<PiHouse />} />
        </div>
    )
}

export default Page
