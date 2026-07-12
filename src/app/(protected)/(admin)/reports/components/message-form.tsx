"use client"

import {Button} from "@/components/ui/button"
import {Field, FieldError, FieldGroup} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {Loader2} from "lucide-react"
import {Controller, useForm} from "react-hook-form"
import {PiPaperPlane} from "react-icons/pi"
import {MessageFormSchema, messageSchema} from "../utils/schema"
import {zodResolver} from "@hookform/resolvers/zod"
import {sendMessage} from "../services/send-message"
import {toast} from "sonner"
import {GetReport} from "../services/get-reports"

type MessageFormProps = {
    report: GetReport
}

const MessageForm = ({report}: MessageFormProps) => {
    const queryClient = useQueryClient()

    const form = useForm<MessageFormSchema>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            report_id: report.id,
            message: "",
        },
    })

    const {mutate, isPending} = useMutation({
        mutationFn: sendMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["report"]})
            form.reset()
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: MessageFormSchema) => {
        mutate(data)
    }

    return (
        <div>
            <form id="message-form" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex gap-2">
                    <FieldGroup>
                        <Controller
                            name="message"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Your message here..." autoComplete="off" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <Button disabled={isPending} type="submit" size="icon" form="message-form">
                        {isPending ? <Loader2 className="animate-spin" /> : <PiPaperPlane className="rotate-90" />}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default MessageForm
