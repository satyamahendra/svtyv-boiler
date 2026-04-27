"use client"

import {authClient} from "@/lib/auth-client"

export function hasPermissions(permissions: string[]) {
    const {data: session} = authClient.useSession()
    const userPermissions = session?.user?.permissions as string[] | undefined
    if (!userPermissions) return false
    return permissions.some((permission) => userPermissions.includes(permission))
}

export function hasRoles(roles: string[]) {
    const {data: session} = authClient.useSession()
    const userRoles = session?.user?.roles as string[] | undefined
    if (!userRoles) return false
    return roles.some((role) => userRoles.includes(role))
}
