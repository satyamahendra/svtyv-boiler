import {PiFlag} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import ReportItem from "./report-item"
import {getReports} from "../services/get-reports"
import PaginationParams from "@/components/custom/pagination-params"

type ReportListProps = {
    page?: number
    search?: string
}

const ReportList = async ({page, search}: ReportListProps) => {
    const data = await getReports(page, search)

    if (!data.success) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PiFlag />
                    </EmptyMedia>
                    <EmptyTitle>Something Went Wrong</EmptyTitle>
                    <EmptyDescription>{data?.message}, Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <AnimDiv className="flex flex-col gap-4">
            {data.data && data.data?.reports.length > 0 ? (
                <div className="flex flex-col overflow-hidden">
                    {data.data.reports.map((report) => (
                        <ReportItem key={report.id} report={report} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiFlag />
                            </EmptyMedia>
                            <EmptyTitle>No Reports Found</EmptyTitle>
                            <EmptyDescription>There are no reports found</EmptyDescription>
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

export default ReportList
