// ponytail: "manage" sits beside CRUD — the matrix renders whatever this lists
export const CRUD_ACTIONS = ["create", "read", "update", "delete", "manage"] as const
export type CrudAction = (typeof CRUD_ACTIONS)[number]

export type ParsedPermission =
    | {action: CrudAction; attribute: string; name: string}
    | {action: "other"; attribute: string; name: string}

export function parsePermission(name: string): ParsedPermission {
    const trimmed = name.trim().toLowerCase()
    const space = trimmed.indexOf(" ")
    const action = space === -1 ? "" : trimmed.slice(0, space)
    const attribute = space === -1 ? trimmed : trimmed.slice(space + 1).trim()

    if ((CRUD_ACTIONS as readonly string[]).includes(action) && attribute) {
        return {action: action as CrudAction, attribute, name}
    }

    return {action: "other", attribute: trimmed, name}
}

export type MatrixGroup = {
    attribute: string
    byAction: Record<CrudAction, boolean>
}

export type GroupedPermissions = {
    matrix: MatrixGroup[]
    other: string[]
}

export function groupPermissions(permissionNames: string[]): GroupedPermissions {
    const attributeMap = new Map<string, Record<CrudAction, boolean>>()
    const other: string[] = []

    for (const name of permissionNames) {
        const parsed = parsePermission(name)
        if (parsed.action === "other") {
            other.push(name)
            continue
        }
        const entry = attributeMap.get(parsed.attribute) ?? {
            create: false,
            read: false,
            update: false,
            delete: false,
            manage: false,
        }
        entry[parsed.action] = true
        attributeMap.set(parsed.attribute, entry)
    }

    const matrix = [...attributeMap.entries()].map(([attribute, byAction]) => ({attribute, byAction}))

    return {matrix, other}
}
