import prisma from "@/lib/prisma/client"

export async function getSessionExtended(userId: string) {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            roles: {
                select: {
                    role_name: true,
                    role: {
                        select: {
                            permissions: {
                                select: {permission_name: true},
                            },
                        },
                    },
                },
            },
            permissions: {
                select: {permission_name: true},
            },
        },
    })

    if (!user) return null

    const roles = user.roles.map((r) => r.role_name)

    // Permissions directly assigned to the user
    const directPermissions = user.permissions.map((p) => p.permission_name)

    // Permissions inherited via roles
    const rolePermissions = user.roles.flatMap((r) => r.role.permissions.map((p) => p.permission_name))

    // Deduplicated combined permissions
    const permissions = [...new Set([...directPermissions, ...rolePermissions])]

    return {roles, permissions}
}
