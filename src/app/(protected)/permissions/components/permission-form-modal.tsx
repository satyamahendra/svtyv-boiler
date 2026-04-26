"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {PiKey, PiPlus} from "react-icons/pi"

import {Button} from "@/components/ui/button"
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {PermissionFormSchema, permissionSchema} from "../utils/schemas"
import {createUpdatePermission} from "../services/create-update-permission"
import {toast} from "sonner"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {Loader2} from "lucide-react"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {getPermission} from "../services/get-permission"
import {useEffect} from "react"

const PermissionFormModal = () => {
    const queryClient = useQueryClient()
    const {getParam, setParams} = useQueryParams()

    const view = getParam("view")

    const {data: permissionData, refetch: refetchPermission} = useQuery({
        queryKey: ["permission"],
        queryFn: () => getPermission(view!),
        enabled: !!view && view !== "create",
    })

    const form = useForm<PermissionFormSchema>({
        resolver: zodResolver(permissionSchema),
        defaultValues: {
            name: "",
            name_before: "",
        },
    })

    const {mutate, isPending} = useMutation({
        mutationFn: createUpdatePermission,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            queryClient.invalidateQueries({queryKey: ["permissions"]})
            form.reset()
            setParams({view: ""})
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: PermissionFormSchema) => {
        mutate(data)
    }

    useEffect(() => {
        if (view !== "create") {
            refetchPermission()
        } else {
            form.reset({name: "", name_before: ""})
        }
    }, [view, refetchPermission])

    useEffect(() => {
        if (permissionData && "success" in permissionData && permissionData.success && permissionData.data) {
            form.reset({name: permissionData.data.name, name_before: permissionData.data.name})
        }
    }, [permissionData, form])

    return (
        <Dialog open={!!view} onOpenChange={(e) => (e ? setParams({view: "create"}) : setParams({view: ""}))}>
            <DialogTrigger asChild>
                <Button>
                    <PiPlus /> Create Permission
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="permission-form">
                <DialogTitle className="flex items-center gap-4">
                    <div className="bg-primary w-10 h-10 flex items-center justify-center rounded-md">
                        <PiKey className="text-primary-foreground text-lg" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-lg font-medium">{view !== "create" ? "Edit" : "Create"} Permission</p>
                        <p className="text-sm text-muted-foreground">{view !== "create" ? "Edit" : "Create"} a custom permission for your organization.</p>
                    </div>
                </DialogTitle>
                <form id="permission-form" onSubmit={form.handleSubmit(onSubmit)} className={isPending ? "pointer-events-none opacity-50" : ""}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Permission Name</FieldLabel>
                                    <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="read users" autoComplete="off" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button disabled={isPending} type="submit" form="permission-form">
                        {isPending ? <Loader2 className="animate-spin" /> : "Create Permission"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PermissionFormModal
