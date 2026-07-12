"use client"

import {Item, ItemContent, ItemTitle, ItemActions} from "@/components/ui/item"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {format} from "date-fns"
import {Badge} from "@/components/ui/badge"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {Separator} from "@/components/ui/separator"
import {PiCalendarDots, PiChatCentered, PiEye} from "react-icons/pi"
import {reportStatusOptions, reportTypeOptions} from "@/utils/constants/report"
import {Button} from "@/components/ui/button"
import {GetReport} from "../services/get-reports"

type ReportItemProps = {
    report: GetReport
}

const ReportItem = ({report}: ReportItemProps) => {
    const {setParams} = useQueryParams()

    const thisStatus = reportStatusOptions.find((option) => option.value === report.status)
    const thisType = reportTypeOptions.find((option) => option.value === report.type)

    return (
        <Item className="bg-muted hover:bg-background duration-200">
            <ItemContent>
                <ItemTitle className="flex justify-between w-full">
                    <span>{report.title}</span>
                </ItemTitle>
                <div className="flex flex-col gap-1 text-muted-foreground">
                    <span className="flex items-center gap-1">{report.user.email}</span>
                    <span className="flex gap-2 items-center">
                        <span className="flex items-center gap-1">
                            <PiCalendarDots className="text-sm" />
                            {format(report.created_at, "dd MMM yyyy")}
                        </span>
                        <Separator orientation="vertical" />
                        <span className="flex items-center gap-1">
                            <PiChatCentered className="text-sm" />
                            {report._count.messages} Messages
                        </span>
                    </span>
                    <span className="flex items-center gap-1">
                        <Badge variant={"default"} className={thisType?.className}>
                            {thisType?.icon}
                            {normalizeString(report.type)}
                        </Badge>
                        <Badge variant={"default"} className={thisStatus?.className}>
                            {thisStatus?.icon}
                            {normalizeString(report.status)}
                        </Badge>
                    </span>
                </div>
            </ItemContent>
            <ItemActions>
                <Button className="rounded-lg" onClick={() => setParams({view: report.id})} size={"icon-sm"} variant="outline">
                    <PiEye />
                </Button>
            </ItemActions>
        </Item>
    )
}

export default ReportItem
