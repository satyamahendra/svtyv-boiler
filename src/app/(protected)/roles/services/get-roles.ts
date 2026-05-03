"use server"

import prisma from "@/lib/prisma/client"
import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {Pagination} from "@/utils/types/pagination"
import {PAGE_SIZE} from "@/utils/constants/pagination"

const roleSelect = Prisma.validator<Prisma.RoleSelect>()({
    name: true,
    permissions: {
        select: {permission_name: true},
    },
})

export type RoleWithPermissions = Prisma.RoleGetPayload<{select: typeof roleSelect}>

export type RolesPage = {
    roles: RoleWithPermissions[]
    pagination: Pagination
}

export const getRoles = async (page: number = 1): Promise<RolesPage> => {
    const skip = (page - 1) * PAGE_SIZE

    const session = await authServer()

    if (!session) throw new Error("Unauthorized")

    const [roles, total] = await Promise.all([
        prisma.role.findMany({
            skip,
            take: PAGE_SIZE,
            orderBy: {name: "asc"},
            select: roleSelect,
        }),
        prisma.role.count(),
    ])

    return {
        roles,
        pagination: {
            page,
            total,
            pageCount: Math.ceil(total / PAGE_SIZE),
        },
    }
}
