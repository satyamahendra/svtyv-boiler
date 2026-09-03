import {PiKey} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {groupPermissions, parsePermission, CRUD_ACTIONS} from "../../roles/utils/permission-matrix"
import {getPermissionsMatrix, MatrixRole} from "../services/get-permissions-matrix"
import PermissionItem from "./permission-item"

export type PermissionRow = {
    attribute: string
    byAction: Record<(typeof CRUD_ACTIONS)[number], boolean>
    isOther: boolean
    connectedRoles: string[]
}

const buildRows = (permissionNames: string[], roles: MatrixRole[]): PermissionRow[] => {
    const {matrix, other} = groupPermissions(permissionNames)

    const roleAttrSets = roles.map((role) => {
        const names = role.permission_names.map((n) => parsePermission(n))
        const set = new Set(names.map((n) => n.attribute))
        return {name: role.name, set}
    })

    const connected = (attribute: string) => roleAttrSets.filter((r) => r.set.has(attribute)).map((r) => r.name)

    return [
        ...matrix.map((m) => {
            const byAction = Object.fromEntries(CRUD_ACTIONS.map((a) => [a, m.byAction[a]])) as PermissionRow["byAction"]
            return {attribute: m.attribute, byAction, isOther: false, connectedRoles: connected(m.attribute)}
        }),
        ...other.map((name) => {
            const byAction = Object.fromEntries(CRUD_ACTIONS.map((a) => [a, false])) as PermissionRow["byAction"]
            return {attribute: name, byAction, isOther: true, connectedRoles: connected(name)}
        }),
    ]
}

const PermissionList = async () => {
    const res = await getPermissionsMatrix()

    if (!res.success) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PiKey />
                    </EmptyMedia>
                    <EmptyTitle>Something Went Wrong</EmptyTitle>
                    <EmptyDescription>{res.message}, Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    const rows = buildRows(res.data.permission_names, res.data.roles)

    return (
        <AnimDiv className="flex flex-col gap-4">
            {rows.length > 0 ? (
                <div className="flex flex-col overflow-hidden">
                    {rows.map((row) => (
                        <PermissionItem key={row.attribute} row={row} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiKey />
                            </EmptyMedia>
                            <EmptyTitle>No permissions found</EmptyTitle>
                            <EmptyDescription>There are currently no permissions available.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            )}
        </AnimDiv>
    )
}

export default PermissionList
