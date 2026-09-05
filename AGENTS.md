<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key guides before writing code:
- `01-app/01-getting-started/05-server-and-client-components.md` — server vs client component rules
- `01-app/02-guides/server-and-client-boundary.md`
- `01-app/02-guides/server-actions.md` — server action contract
- `01-app/01-getting-started/07-mutating-data.md` — plus `01-app/02-guides/forms.md`
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:repo-conventions -->
# Repo Conventions (verified against this codebase)

## Server actions
- File: `"use server"` on line 1, colocated at `src/app/(protected)/(admin)/<feature>/services/*.ts` (shared ones in `src/utils/services/` or `src/utils/helpers/`).
- Signature: `export async function x(input): Promise<ServerResult<T>>` with `T` from `@/generated/index`.
- Body order: `zod.safeParse(data)` → `const session = await authServer()` (throw `"Unauthorized"` if missing) → mutate via `prisma` from `@/lib/prisma/client` (wrap multi-writes in `prisma.$transaction`) → `revalidatePath()` → `return {success: true, data, message}`.
- catch: `catch (error) { return handleServerError(error) }`.
- Response types (`src/utils/types/server-action.ts`):
  - `ServerResult<T> = {success:true; data:T; message:string} | {success:false; data:null; message:string; errors?: Record<string,string[]>}`
  - `handleServerError` (in `src/utils/helpers/handle-server-errors.ts`) adds `status` (400/422/500/503) and classifies Zod/Prisma/Midtrans/Axios errors.
- Client components import server actions directly and call them as functions; never duplicate the auth or validation logic client-side.

## Client / server boundary
- Add `"use client"` only to interactive/stateful components (handlers, hooks, form state).
- UI primitives live in `src/components/ui/`, shared interactive in `src/components/custom/`, feature components in `src/app/(protected)/(admin)/<feature>/components/`.
- Pages and non-interactive pieces stay server components; pass data down as props, do not fetch on the client where a server action already returns it.
<!-- END:repo-conventions -->
