import axios from "axios"

export function handleClientError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as Record<string, unknown> | undefined
        return typeof data?.message === "string" ? data.message : error.message
    }

    if (error instanceof Error) return error.message

    return "An unexpected error occurred."
}
