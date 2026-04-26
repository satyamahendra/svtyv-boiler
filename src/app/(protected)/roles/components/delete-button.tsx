"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {PiTrash} from "react-icons/pi"
import {deleteRole} from "../services/delete-role"
import {toast} from "sonner"
import {Role} from "@/generated/index"
import {useState} from "react"

type DeleteButtonProps = {
    role: Role
}

const DeleteButton = ({role}: DeleteButtonProps) => {
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)

    const {mutate, isPending} = useMutation({
        mutationFn: deleteRole,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            setIsOpen(false)
            queryClient.invalidateQueries({queryKey: ["roles"]})
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button className="rounded-lg" disabled={isPending} size={"icon-sm"} variant="destructive">
                    <PiTrash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className="space-y-2">
                    <AlertDialogTitle className="flex flex-col justify-center items-center w-full gap-2">
                        <div className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center">
                            <PiTrash className="text-muted-foreground text-xl" />
                        </div>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        This action cannot be undone. This will permanently delete this role from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={() => mutate(role.name!)}>
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteButton
