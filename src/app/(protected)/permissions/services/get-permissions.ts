"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {PAGE_SIZE} from "@/utils/constants/pagination"
import {Pagination} from "@/utils/types/pagination"

const permissionSelect = Prisma.validator<Prisma.PermissionSelect>()({
    name: true,
    roles: {
        select: {role_name: true},
    },
})

export type PermissionWithRoles = Prisma.PermissionGetPayload<{select: typeof permissionSelect}>

export type PermissionsPage = {
    permissions: PermissionWithRoles[]
    pagination: Pagination
}

export async function getPermissions(page: number = 1): Promise<PermissionsPage> {
    const skip = (page - 1) * PAGE_SIZE

    const session = await authServer()

    if (!session) throw new Error("Unauthorized")

    const [permissions, total] = await Promise.all([
        prisma.permission.findMany({
            skip,
            take: PAGE_SIZE,
            orderBy: {name: "asc"},
            select: permissionSelect,
        }),
        prisma.permission.count(),
    ])

    return {
        permissions,
        pagination: {
            page,
            total,
            pageCount: Math.ceil(total / PAGE_SIZE),
        },
    }
}
