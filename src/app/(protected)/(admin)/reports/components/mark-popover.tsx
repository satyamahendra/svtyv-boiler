"use client"

import {Button} from "@/components/ui/button"
import {Popover, PopoverContent, PopoverHeader, PopoverTrigger} from "@/components/ui/popover"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {PiDotsThreeVertical} from "react-icons/pi"
import {updateReport} from "../services/update-report"
import {toast} from "sonner"
import {StatusType} from "@/utils/types/report"
import {GetReport} from "../services/get-reports"

type MarkPopoverProps = {
    report: GetReport
}

const MarkPopover = ({report}: MarkPopoverProps) => {
    const queryClient = useQueryClient()

    const {mutate, isPending} = useMutation({
        mutationFn: updateReport,
        onSuccess() {
            queryClient.invalidateQueries({queryKey: ["reports"]})
            toast.success("Report updated successfully")
        },
        onError(err) {
            toast.error(err.message)
        },
    })

    const hanldeSubmit = (status: StatusType) => {
        mutate({id: report.id, status: status, resolved_at: status === "resolved" ? new Date() : undefined})
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size={"icon"} variant="ghost">
                    <PiDotsThreeVertical />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-2">
                <PopoverHeader>
                    <div className="flex flex-col gap-y-2">
                        <Button size="sm" disabled={isPending} onClick={() => hanldeSubmit("resolved")}>
                            Resolve
                        </Button>
                        <Button size="sm" variant="outline" disabled={isPending} onClick={() => hanldeSubmit("in_review")}>
                            In Review
                        </Button>
                        <Button size="sm" variant="destructive" disabled={isPending} onClick={() => hanldeSubmit("rejected")}>
                            Reject
                        </Button>
                    </div>
                </PopoverHeader>
            </PopoverContent>
        </Popover>
    )
}

export default MarkPopover
