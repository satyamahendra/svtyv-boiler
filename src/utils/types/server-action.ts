export type ServerResult<T> = {success: true; data: T; message: string} | {success: false; data: null; message: string; errors?: Record<string, string[]>}

export type ServerErrorResult = {
    success: false
    data: null
    message: string
    status: number
    errors?: Record<string, string[]>
}
