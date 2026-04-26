// lib/handle-error.ts

import {Prisma} from "@/generated/index"
import {ZodError} from "zod"
import {MutationResult, ActionResult} from "@/utils/types/server-action"

// ─── Core classifier ──────────────────────────────────────────────────────────

function classifyPrisma(error: Prisma.PrismaClientKnownRequestError): {
    message: string
    errors?: Record<string, string[]>
} {
    switch (error.code) {
        case "P2002": {
            const raw = error.meta?.target
            const fields: string[] = Array.isArray(raw)
                ? raw
                : typeof raw === "string"
                ? [raw.replace(/.*_([^_]+)_key$/, "$1")] // "Role_name_key" → "name"
                : ["field"]

            return {
                message: `A record with this ${fields.join(", ")} already exists.`,
                errors: Object.fromEntries(fields.map((f) => [f, ["Already taken."]])),
            }
        }
        case "P2025":
            return {message: "Record not found."}
        case "P2003": {
            const field = (error.meta?.field_name as string) ?? "relation"
            return {
                message: "Related record not found.",
                errors: {[field]: ["Does not exist."]},
            }
        }
        case "P2014":
            return {message: "The change violates a required relation."}
        case "P2016":
            return {message: "Query interpretation error."}
        default:
            return {message: `Database error. (${error.code})`}
    }
}

// ─── MutationResult handler ───────────────────────────────────────────────────

export function handleMutationError<T>(error: unknown): MutationResult<T> {
    // Zod
    if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {}
        for (const issue of error.issues) {
            const key = issue.path.join(".") || "_root"
            ;(errors[key] ??= []).push(issue.message)
        }
        return {success: false, data: null, message: "Validation failed.", errors}
    }

    // Prisma — known
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const {message, errors} = classifyPrisma(error)
        return {success: false, data: null, message, errors}
    }

    // Prisma — validation (bad query shape)
    if (error instanceof Prisma.PrismaClientValidationError) {
        return {success: false, data: null, message: "Invalid data provided."}
    }

    // Prisma — connection
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return {success: false, data: null, message: "Database connection failed."}
    }

    // Native JS errors
    if (error instanceof Error) {
        return {success: false, data: null, message: error.message}
    }

    return {success: false, data: null, message: "An unexpected error occurred."}
}

// ─── ActionResult handler ─────────────────────────────────────────────────────

export function handleActionError<T>(error: unknown): ActionResult<T> {
    const {message} = handleMutationError(error)
    return {success: false, error: message}
}
