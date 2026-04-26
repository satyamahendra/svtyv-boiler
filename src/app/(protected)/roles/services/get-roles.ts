"use server"

import prisma from "@/lib/prisma/client"
import {unstable_cache} from "next/cache"

const PAGE_SIZE = 10

export type RolesPage = {
    roles: {name: string}[]
    pagination: {
        total: number
        page: number
        pageCount: number
    }
}

export const getRoles = unstable_cache(async (page: number = 1): Promise<RolesPage> => {
    const skip = (page - 1) * PAGE_SIZE

    const [roles, total] = await Promise.all([
        prisma.role.findMany({
            skip,
            take: PAGE_SIZE,
            orderBy: {name: "asc"},
            select: {name: true},
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
})
