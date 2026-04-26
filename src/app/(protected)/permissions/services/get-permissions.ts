"use server"

import prisma from "@/lib/prisma/client"

const PAGE_SIZE = 10

export type PermissionsPage = {
    permissions: {
        name: string
    }[]
    pagination: {
        total: number
        page: number
        pageCount: number
    }
}

export async function getPermissions(page: number = 1): Promise<PermissionsPage> {
    const skip = (page - 1) * PAGE_SIZE

    const [permissions, total] = await Promise.all([
        prisma.permission.findMany({
            skip,
            take: PAGE_SIZE,
            orderBy: {name: "asc"},
            select: {
                name: true,
            },
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
