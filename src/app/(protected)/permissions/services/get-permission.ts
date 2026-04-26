"use server"

import {Permission} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {ActionResult} from "@/utils/types/server-action"

export async function getPermission(name: string): Promise<ActionResult<Permission>> {
    try {
        const permission = await prisma.permission.findUnique({
            where: {name},
            select: {name: true},
        })

        if (!permission) {
            return {success: false, error: "Permission not found"}
        }

        return {success: true, data: permission}
    } catch (error) {
        return {success: false, error: "Failed to fetch permission"}
    }
}
