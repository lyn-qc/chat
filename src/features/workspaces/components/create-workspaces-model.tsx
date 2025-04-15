
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateWorkspaceModel } from "../store/use-create-workspace-model"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCreateWorkspaces } from "../api/use-create-workspaces"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const CreateWorkspaceModal = () => {
    const router = useRouter()
    const [open, setOpen] = useCreateWorkspaceModel()
    const [workspaceName, setWorkspaceName] = useState('')
    const { mutate, isPending } = useCreateWorkspaces()
    const handleClose = () => {
        // handle create workspace logic here
        setOpen(false)
        setWorkspaceName('')
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate({ name: workspaceName }, {
            onSuccess: (data) => {
                toast.success('Workspace created successfully')
                router.push(`/workspaces/${data}`)
                handleClose()
            }
        }

        )
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        value={workspaceName}
                        disabled={isPending}
                        placeholder="Workspace Name"
                        required
                        autoFocus
                        minLength={3}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                    >
                    </Input>
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}