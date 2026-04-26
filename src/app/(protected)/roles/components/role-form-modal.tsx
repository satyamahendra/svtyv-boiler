"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {PiCardholder, PiPlus} from "react-icons/pi"

import {Button} from "@/components/ui/button"
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {RoleFormSchema, roleSchema} from "../utils/schemas"
import {createUpdateRole} from "../services/create-update-role"
import {toast} from "sonner"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {Loader2} from "lucide-react"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {getRole} from "../services/get-role"
import {useEffect} from "react"

const RoleFormModal = () => {
    const queryClient = useQueryClient()
    const {getParam, setParams} = useQueryParams()

    const view = getParam("view")

    const {data: roleData, refetch: refetchRole} = useQuery({
        queryKey: ["role"],
        queryFn: () => getRole(view!),
        enabled: !!view && view !== "create",
    })

    const form = useForm<RoleFormSchema>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            name_before: "",
        },
    })

    const {mutate, isPending} = useMutation({
        mutationFn: createUpdateRole,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            queryClient.invalidateQueries({queryKey: ["roles"]})
            form.reset()
            setParams({view: ""})
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: RoleFormSchema) => {
        mutate(data)
    }

    useEffect(() => {
        if (view !== "create") {
            refetchRole()
        } else {
            form.reset({name: "", name_before: ""})
        }
    }, [view, refetchRole])

    useEffect(() => {
        if (roleData && "success" in roleData && roleData.success && roleData.data) {
            form.reset({name: roleData.data.name, name_before: roleData.data.name})
        }
    }, [roleData, form])

    return (
        <Dialog open={!!view} onOpenChange={(e) => (e ? setParams({view: "create"}) : setParams({view: ""}))}>
            <DialogTrigger asChild>
                <Button>
                    <PiPlus /> Create Role
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="role-form">
                <DialogTitle className="flex items-center gap-4">
                    <div className="bg-primary w-10 h-10 flex items-center justify-center rounded-md">
                        <PiCardholder className="text-primary-foreground text-lg" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-lg font-medium">{view !== "create" ? "Edit" : "Create"} Role</p>
                        <p className="text-sm text-muted-foreground">{view !== "create" ? "Edit" : "Create"} a custom role for your organization.</p>
                    </div>
                </DialogTitle>
                <form id="role-form" onSubmit={form.handleSubmit(onSubmit)} className={isPending ? "pointer-events-none opacity-50" : ""}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Role Name</FieldLabel>
                                    <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Admin" autoComplete="off" />
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
                    <Button disabled={isPending} type="submit" form="role-form">
                        {isPending ? <Loader2 className="animate-spin" /> : "Create Role"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RoleFormModal
