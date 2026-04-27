"use server"

import {authServer} from "@/lib/auth-server"

export async function hasPermissions(permissions: string[]) {
    const session = await authServer()
    const userPermissions = session?.user?.permissions as string[] | undefined
    if (!userPermissions) return false
    return permissions.some((permission) => userPermissions.includes(permission))
}

export async function hasRoles(roles: string[]) {
    const session = await authServer()
    const userRoles = session?.user?.roles as string[] | undefined
    if (!userRoles) return false
    return roles.some((role) => userRoles.includes(role))
}
