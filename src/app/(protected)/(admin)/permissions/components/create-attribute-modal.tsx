"use client"

import {useState} from "react"
import {PiKey, PiPlus} from "react-icons/pi"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field"
import {createPermissionsFromAttribute} from "../services/create-permissions-from-attribute"
import {toast} from "sonner"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {Loader2} from "lucide-react"
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"

const CreatePermissionModal = () => {
    const queryClient = useQueryClient()
    const {isMobile} = useScreenSize()
    const [open, setOpen] = useState(false)

    const {mutate, isPending} = useMutation({
        mutationFn: createPermissionsFromAttribute,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            queryClient.invalidateQueries({queryKey: ["permissions-matrix"]})
            setOpen(false)
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    return (
        <Drawer swipeDirection={isMobile ? "down" : "right"} open={open} onOpenChange={setOpen}>
            <DrawerTrigger
                render={
                    <Button>
                        <PiPlus /> Add Attribute
                    </Button>
                }></DrawerTrigger>
            <DrawerContent aria-describedby="permission-form" className={cn(isMobile ? "h-[60vh]" : "")}>
                <DrawerHeader className="flex flex-col items-center justify-center">
                    <DrawerTitle className="flex items-center gap-4">
                        <PiKey /> Add Attribute
                    </DrawerTitle>
                    <DrawerDescription className="flex items-center gap-4">Type an attribute to auto-create its CRUD + manage permissions.</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 flex-1">
                    <form
                        id="permission-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            const data = new FormData(e.currentTarget)
                            const attribute = String(data.get("attribute") ?? "").trim()
                            if (!attribute) return
                            mutate(attribute)
                        }}
                        className={isPending ? "pointer-events-none opacity-50" : ""}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="attribute">Attribute Name</FieldLabel>
                                <Input id="attribute" name="attribute" placeholder="users" autoComplete="off" required />
                            </Field>
                            <FieldDescription>Creates: create, read, update, delete, manage for this attribute.</FieldDescription>
                        </FieldGroup>
                    </form>
                </div>

                <DrawerFooter>
                    <DrawerClose
                        render={
                            <Button variant="outline" className="w-full">
                                Cancel
                            </Button>
                        }></DrawerClose>
                    <Button disabled={isPending} type="submit" form="permission-form">
                        {isPending ? <Loader2 className="animate-spin" /> : "Create"}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default CreatePermissionModal
