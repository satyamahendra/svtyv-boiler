export type ActionResult<T = null> = {
    success: boolean
    data: T | null
    error: string | null
}
