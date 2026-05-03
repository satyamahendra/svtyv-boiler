"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {PiKey, PiPlus} from "react-icons/pi"

import {Button} from "@/components/ui/button"
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field"
import {PermissionFormSchema, permissionSchema} from "../utils/schemas"
import {createUpdatePermission} from "../services/create-update-permission"
import {toast} from "sonner"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {Loader2} from "lucide-react"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {getPermission} from "../services/get-permission"
import {useEffect} from "react"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {Checkbox} from "@/components/ui/checkbox"
import {getRoles} from "@/utils/services/get-roles"

const PermissionFormModal = () => {
    const queryClient = useQueryClient()
    const {getParam, setParams} = useQueryParams()

    const view = getParam("view")

    const {
        data: permissionData,
        refetch: refetchPermission,
        isLoading,
    } = useQuery({
        queryKey: ["permission", view],
        queryFn: () => getPermission(view!),
        enabled: !!view && view !== "create",
    })

    const {data: rolesData} = useQuery({
        queryKey: ["roles", view],
        queryFn: () => getRoles(),
    })

    const form = useForm<PermissionFormSchema>({
        resolver: zodResolver(permissionSchema),
        defaultValues: {
            name: "",
            name_before: "",
            roles: [],
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
        if (view === "create") {
            form.reset({name: "", name_before: "", roles: []})
            return
        }

        refetchPermission()

        if (permissionData?.success && permissionData.data) {
            form.reset({
                name: permissionData.data.name,
                name_before: permissionData.data.name,
                roles: permissionData.data.roles.map((role) => role.role_name),
            })
        }
    }, [view, permissionData, form, refetchPermission])

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

                {isLoading ? (
                    <div className="flex items-center justify-center h-20">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : !permissionData?.success && view !== "create" && !!view ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiKey />
                            </EmptyMedia>
                            <EmptyTitle>Failed to fetch permission</EmptyTitle>
                            <EmptyDescription>Failed to fetch permission. Please try again.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <>
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

                                <Controller
                                    name="roles"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <FieldSet>
                                            <FieldLegend variant="label">Roles</FieldLegend>
                                            <FieldDescription>Define the roles for this permission.</FieldDescription>
                                            <FieldGroup data-slot="checkbox-group">
                                                {rolesData?.success &&
                                                    rolesData.data.map((role) => (
                                                        <Field key={role.name} orientation="horizontal" data-invalid={fieldState.invalid}>
                                                            <Checkbox
                                                                id={`form-rhf-checkbox-${role.name}`}
                                                                name={field.name}
                                                                aria-invalid={fieldState.invalid}
                                                                value={role.name}
                                                                checked={field.value?.includes(role.name)}
                                                                onCheckedChange={(checked) => {
                                                                    const newValue = checked
                                                                        ? [...(field.value ?? []), role.name]
                                                                        : (field.value ?? []).filter((value) => value !== role.name)
                                                                    field.onChange(newValue)
                                                                }}
                                                            />
                                                            <FieldLabel htmlFor={`form-rhf-checkbox-${role.name}`} className="font-normal">
                                                                {role.name}
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
                            <Button disabled={isPending} type="submit" form="permission-form">
                                {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default PermissionFormModal
