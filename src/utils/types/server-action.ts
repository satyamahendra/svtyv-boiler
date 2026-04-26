export type ActionResult<T> = {success: true; data: T} | {success: false; error: string}

export type MutationResult<T> = {success: true; data: T; message: string} | {success: false; data: null; message: string; errors?: Record<string, string[]>}
