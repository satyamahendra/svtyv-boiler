import {groupPermissions, parsePermission} from "./permission-matrix"

const assert = (cond: boolean, msg: string) => {
    if (!cond) throw new Error("permission-matrix self-check: " + msg)
}

const parsed = parsePermission("read users")
assert(parsed.action === "read", "parse read")
assert(parsed.attribute === "users", "extract attribute")

const other = parsePermission("manage users")
assert(other.action === "other", "manage falls to other")

const {matrix, other: others} = groupPermissions([
    "read users",
    "update users",
    "delete users",
    "read orders",
    "manage reports",
    "weird name",
])

const users = matrix.find((m) => m.attribute === "users")
const orders = matrix.find((m) => m.attribute === "orders")
assert(!!users && users.byAction.read && users.byAction.update && users.byAction.delete && !users.byAction.create, "users matrix cells")
assert(!!orders && orders.byAction.read && !orders.byAction.create, "orders matrix cells")
assert(others.includes("manage reports") && others.includes("weird name"), "others grouped")

console.log("permission-matrix self-check: OK")
