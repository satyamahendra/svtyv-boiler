"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {PiCardholder, PiKey, PiPlus} from "react-icons/pi"

import {Button} from "@/components/ui/button"
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field"
import {RoleFormSchema, roleSchema} from "../utils/schemas"
import {createUpdateRole} from "../services/create-update-role"
import {toast} from "sonner"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {Loader2} from "lucide-react"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {getRole} from "../services/get-role"
import {useEffect} from "react"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {Checkbox} from "@/components/ui/checkbox"
import {getPermissions} from "@/utils/services/get-permissions"

const RoleFormModal = () => {
    const queryClient = useQueryClient()
    const {getParam, setParams} = useQueryParams()

    const view = getParam("view")

    const {
        data: roleData,
        refetch: refetchRole,
        isLoading,
    } = useQuery({
        queryKey: ["role", view],
        queryFn: () => getRole(view!),
        enabled: !!view && view !== "create",
    })

    const {data: permissionsData} = useQuery({
        queryKey: ["permissions", view],
        queryFn: () => getPermissions(),
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
        if (view === "create") {
            form.reset({name: "", name_before: "", permissions: []})
            return
        }

        refetchRole()

        if (roleData?.success && roleData.data) {
            form.reset({
                name: roleData.data.name,
                name_before: roleData.data.name,
                permissions: roleData.data.permissions.map((permission) => permission.permission_name),
            })
        }
    }, [view, roleData, form, refetchRole])

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

                {isLoading ? (
                    <div className="flex items-center justify-center h-20">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : !roleData?.success && view !== "create" && !!view ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiKey />
                            </EmptyMedia>
                            <EmptyTitle>Failed to fetch role</EmptyTitle>
                            <EmptyDescription>Failed to fetch role. Please try again.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <>
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

                                <Controller
                                    name="permissions"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <FieldSet>
                                            <FieldLegend variant="label">Permissions</FieldLegend>
                                            <FieldDescription>Define the permissions for this role.</FieldDescription>
                                            <FieldGroup data-slot="checkbox-group">
                                                {permissionsData?.success &&
                                                    permissionsData.data.map((permission) => (
                                                        <Field key={permission.name} orientation="horizontal" data-invalid={fieldState.invalid}>
                                                            <Checkbox
                                                                id={`form-rhf-checkbox-${permission.name}`}
                                                                name={field.name}
                                                                aria-invalid={fieldState.invalid}
                                                                value={permission.name}
                                                                checked={field.value?.includes(permission.name)}
                                                                onCheckedChange={(checked) => {
                                                                    const newValue = checked
                                                                        ? [...(field.value ?? []), permission.name]
                                                                        : (field.value ?? []).filter((value) => value !== permission.name)
                                                                    field.onChange(newValue)
                                                                }}
                                                            />
                                                            <FieldLabel htmlFor={`form-rhf-checkbox-${permission.name}`} className="font-normal">
                                                                {permission.name}
                                                            </FieldLabel>
                                                        </Field>
                                                    ))}
                                            </FieldGroup>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldSet>
                                    )}
                                />
                            </FieldGroup>
                        </form>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button disabled={isPending} type="submit" form="role-form">
                                {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default RoleFormModal
