"use server"

import {Permission} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {ServerResult} from "@/utils/types/server-action"
import {handleServerError} from "../helpers/handle-server-errors"

export async function getPermissions(): Promise<ServerResult<Permission[]>> {
    try {
        const permissions = await prisma.permission.findMany({
            select: {name: true},
        })

        if (!permissions) throw new Error("Permissions not found")

        return {success: true, data: permissions, message: "Permissions fetched successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
