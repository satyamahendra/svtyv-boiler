"use client"

import {useEffect, useMemo, useState} from "react"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {PiKey, PiTrash} from "react-icons/pi"
import {Loader2} from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {Switch} from "@/components/ui/switch"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {toast} from "sonner"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"
import {getPermissionsMatrix} from "../services/get-permissions-matrix"
import {updateRolePermissions} from "../../roles/services/update-role-permissions"
import {togglePermission} from "../services/toggle-permission"
import {deletePermission} from "../services/delete-permission"
import {parsePermission} from "../../roles/utils/permission-matrix"

const PermissionDetailModal = () => {
    const queryClient = useQueryClient()
    const {getParam, setParams} = useQueryParams()
    const {isMobile} = useScreenSize()

    const view = getParam("view")

    const {data: matrix} = useQuery({
        queryKey: ["permissions-matrix"],
        queryFn: getPermissionsMatrix,
    })

    const allPerms = useMemo(() => matrix?.data?.permissions ?? [], [matrix?.data])
    const roles = useMemo(() => matrix?.data?.roles ?? [], [matrix?.data])

    const {relevantPerms, isCrud} = useMemo(() => {
        if (!view) return {relevantPerms: [], isCrud: false}
        const crud = allPerms.filter((p) => {
            const parsed = parsePermission(p.name)
            return parsed.action !== "other" && parsed.attribute === view
        })
        if (crud.length > 0) return {relevantPerms: crud, isCrud: true}
        return {relevantPerms: allPerms.filter((p) => p.name === view), isCrud: false}
    }, [allPerms, view])

    const [rolePerms, setRolePerms] = useState<Record<string, string[]>>({})
    const [isActive, setIsActive] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const initPerms: Record<string, string[]> = {}
        const initActive: Record<string, boolean> = {}
        for (const role of roles) {
            initPerms[role.name] = role.permission_names
        }
        for (const p of allPerms) {
            initActive[p.name] = p.is_active
        }
        setRolePerms(initPerms)
        setIsActive(initActive)
    }, [roles, allPerms])

    const invalidation = () => {
        queryClient.invalidateQueries({queryKey: ["permissions-matrix"]})
    }

    const saveRole = useMutation({
        mutationFn: ({roleName, permissions}: {roleName: string; permissions: string[]}) => updateRolePermissions(roleName, permissions),
        onError: (error) => toast.error(error.message),
    })

    const saveActive = useMutation({
        mutationFn: ({name, isActive}: {name: string; isActive: boolean}) => togglePermission(name, isActive),
        onError: (error) => toast.error(error.message),
    })

    const deletePerm = useMutation({
        mutationFn: deletePermission,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            invalidation()
            setParams({view: ""})
        },
        onError: (error) => toast.error(error.message),
    })

    const toggleRolePermission = (roleName: string, permissionName: string, checked: boolean) => {
        const current = rolePerms[roleName] ?? []
        const next = checked ? [...new Set([...current, permissionName])] : current.filter((n) => n !== permissionName)
        setRolePerms((prev) => ({...prev, [roleName]: next}))
    }

    const isPending = saveRole.isPending || saveActive.isPending || deletePerm.isPending

    const onSubmit = async () => {
        try {
            const results = await Promise.all([
                ...roles
                    .filter((role) => {
                        const next = [...(rolePerms[role.name] ?? [])].sort()
                        const orig = [...role.permission_names].sort()
                        return JSON.stringify(next) !== JSON.stringify(orig)
                    })
                    .map((role) => saveRole.mutateAsync({roleName: role.name, permissions: rolePerms[role.name] ?? []})),
                ...relevantPerms.filter((p) => isActive[p.name] !== p.is_active).map((p) => saveActive.mutateAsync({name: p.name, isActive: isActive[p.name]})),
            ])

            if (results.length === 0) return

            const failed = results.filter((r) => r && !r.success)
            if (failed.length > 0) {
                toast.error("Some changes failed to save")
            } else {
                toast.success("Changes saved")
            }
            invalidation()
        } catch {
            toast.error("Failed to save changes")
        }
    }

    return (
        <Drawer swipeDirection={isMobile ? "down" : "right"} open={!!view} onOpenChange={(open) => !open && setParams({view: ""})}>
            <DrawerContent aria-describedby="permission-detail" className={cn(isMobile ? "h-[80vh]" : "")}>
                <DrawerHeader className="flex flex-col items-center justify-center">
                    <DrawerTitle className="flex items-center gap-4">
                        <PiKey /> {view || ""}
                    </DrawerTitle>
                    <DrawerDescription className="flex items-center gap-4">Connect this attribute to roles and toggle availability.</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 flex-1 overflow-y-auto">
                    {!matrix?.data ? (
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    ) : relevantPerms.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <PiKey />
                                </EmptyMedia>
                                <EmptyTitle>No matching permissions</EmptyTitle>
                                <EmptyDescription>{`No permissions found for "${view}".`}</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                {relevantPerms.map((p) => (
                                    <div key={p.name} className="flex items-center gap-2">
                                        <Badge variant="outline" className="capitalize">
                                            {p.name}
                                        </Badge>
                                        <span className="ml-auto text-xs text-muted-foreground">{isActive[p.name] ? "enabled" : "disabled"}</span>
                                        <Switch size="sm" checked={isActive[p.name] ?? false} onCheckedChange={(c) => setIsActive((prev) => ({...prev, [p.name]: c}))} />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="rounded-lg" size={"icon-sm"} variant="destructive">
                                                    <PiTrash />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader className="space-y-2">
                                                    <AlertDialogTitle className="flex flex-col items-center justify-center w-full gap-2">
                                                        <div className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center">
                                                            <PiTrash className="text-muted-foreground text-xl" />
                                                        </div>
                                                        Delete &quot;{p.name}&quot;?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-center">
                                                        This will remove this permission from all roles and users. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="flex justify-center gap-2">
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction disabled={deletePerm.isPending} onClick={() => deletePerm.mutate(p.name)}>
                                                        {deletePerm.isPending ? "Deleting..." : "Delete"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                            </div>

                            <div className="overflow-x-auto rounded-xl border">
                                <table className="w-full min-w-max text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="sticky left-0 bg-muted/50 px-3 py-2 text-left font-medium text-muted-foreground">Role</th>
                                            {isCrud &&
                                                relevantPerms.map((p) => (
                                                    <th key={p.name} className="px-3 py-2 text-center font-medium capitalize">
                                                        {parsePermission(p.name).action}
                                                    </th>
                                                ))}
                                            {!isCrud && <th className="px-3 py-2 text-center font-medium">Assigned</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map((role) => (
                                            <tr key={role.name} className="border-b last:border-0">
                                                <td className="sticky left-0 bg-background px-3 py-2 font-medium">{role.name}</td>
                                                {relevantPerms.map((p) => {
                                                    const checked = (rolePerms[role.name] ?? []).includes(p.name)
                                                    return (
                                                        <td key={p.name} className="px-3 py-2 text-center">
                                                            <Checkbox
                                                                checked={checked}
                                                                onCheckedChange={(c) => toggleRolePermission(role.name, p.name, !!c)}
                                                                title={p.name}
                                                            />
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <DrawerFooter>
                    <Button disabled={isPending} type="button" onClick={onSubmit} className="w-full">
                        {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                    </Button>
                    <DrawerClose
                        render={
                            <Button variant="outline" className="w-full">
                                Close
                            </Button>
                        }></DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default PermissionDetailModal
