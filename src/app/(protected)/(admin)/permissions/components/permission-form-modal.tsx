"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {PiKey, PiPlus} from "react-icons/pi"
import {Button} from "@/components/ui/button"
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
import {Switch} from "@/components/ui/switch"
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"

const PermissionFormModal = () => {
    const queryClient = useQueryClient()
    const {getParam, setParams} = useQueryParams()
    const {isMobile} = useScreenSize()

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
            is_active: true,
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
            form.reset({name: "", name_before: "", roles: [], is_active: true})
            return
        }

        refetchPermission()

        if (permissionData?.success && permissionData.data) {
            form.reset({
                name: permissionData.data.name,
                name_before: permissionData.data.name,
                roles: permissionData.data.roles.map((role) => role.role_name),
                is_active: permissionData.data.is_active,
            })
        }
    }, [view, permissionData, form, refetchPermission])

    return (
        <Drawer direction={isMobile ? "bottom" : "right"} open={!!view} onOpenChange={(e) => (e ? setParams({view: "create"}) : setParams({view: ""}))}>
            <DrawerTrigger asChild>
                <Button>
                    <PiPlus /> Create Permission
                </Button>
            </DrawerTrigger>
            <DrawerContent aria-describedby="permission-form" className={cn(isMobile ? "h-[80vh]" : "")}>
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-4">{view !== "create" ? "Edit" : "Create"} Permission</DrawerTitle>
                    <DrawerDescription className="flex items-center gap-4">
                        {view !== "create" ? "Edit" : "Create"} a custom permission for your organization.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-6">
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

                                    <Controller
                                        name="is_active"
                                        control={form.control}
                                        render={({field}) => (
                                            <Field>
                                                <FieldLabel htmlFor="is_active">is active?</FieldLabel>
                                                <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </form>
                        </>
                    )}
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </DrawerClose>
                    <Button disabled={isPending} type="submit" form="permission-form">
                        {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default PermissionFormModal
