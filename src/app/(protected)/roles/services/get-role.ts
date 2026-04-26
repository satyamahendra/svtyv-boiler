"use server"

import {Role} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {ActionResult} from "@/utils/types/server-action"

export async function getRole(name: string): Promise<ActionResult<Role>> {
    try {
        const role = await prisma.role.findUnique({
            where: {name},
            select: {name: true},
        })

        if (!role) {
            return {success: false, error: "Role not found"}
        }

        return {success: true, data: role}
    } catch (error) {
        return {success: false, error: "Failed to fetch role"}
    }
}
