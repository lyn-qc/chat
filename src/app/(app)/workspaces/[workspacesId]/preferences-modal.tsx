import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useRemoveWorkspaces } from "@/features/workspaces/api/use-delete-workspaces";
import { useUpdateWorkspaces } from "@/features/workspaces/api/use-update-workspaces";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DialogClose } from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface PrreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string
}

export default function PreferencesModal({ open, setOpen, initialValue }: PrreferencesModalProps) {
    const router = useRouter()
    const [value, setValue] = useState(initialValue)
    const worksapceId = useWorkspaceId()
    const { mutate: updateWorkspaces, isPending: isUpdatingWorkspaces } = useUpdateWorkspaces()
    const { mutate: removeWorkspaces, isPending: isRemovingWorkspaces } = useRemoveWorkspaces()
    const [ConfirmDialog, confirm] = useConfirm(
        "你确定要这么做吗?",
        "此操作不可逆"
    )
    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        updateWorkspaces({ id: worksapceId, name: value }, {
            onSuccess: () => {
                setOpen(false)
                toast.success("更新成功")
            },
            onError: (e) => {
                toast.error("更新失败")
            }
        })
    }
    const handleDelete = async () => {
        const ok = await confirm()
        if (!ok) {
            return
        }
        removeWorkspaces({ id: worksapceId }, {
            onSuccess: () => {
                setOpen(false)
                toast.success("Workspace deleted successfully")
                router.push(`/chat`);
            },
            onError: (e) => {
                toast.error("Error deleting workspace")
            }
        })
    }
    return (
        <>
            <ConfirmDialog></ConfirmDialog>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>{value}</DialogTitle>
                    </DialogHeader>
                    <div className="px-4 py-4 flex flex-col gap-y-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            worksapce name
                                        </p>
                                        <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                                            Edit
                                        </p>
                                    </div>
                                    <p className="text-sm">
                                        {value}
                                    </p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change workspace name</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={(e) => { handleEdit(e) }}>
                                    <Input
                                        value={value}
                                        onChange={(e) => { setValue(e.target.value) }}
                                        placeholder="New workspace name"
                                        required
                                        autoFocus
                                        disabled={isUpdatingWorkspaces}
                                        minLength={3}
                                        maxLength={30}

                                    />
                                    <DialogFooter>
                                        <Button disabled={isUpdatingWorkspaces} type="submit">
                                            Save
                                        </Button>
                                        <DialogClose asChild>
                                            <Button
                                                className="ml-3"
                                                variant="outline" disabled={isUpdatingWorkspaces}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <button
                            disabled={isRemovingWorkspaces}
                            onClick={() => {
                                handleDelete()
                            }}
                            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                        >
                            <TrashIcon className="size-4"></TrashIcon>
                            <p className="text-sm font-semibold">
                                删除工作区
                            </p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}