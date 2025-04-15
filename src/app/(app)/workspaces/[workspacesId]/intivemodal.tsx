import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useNewJoinCode } from "@/features/workspaces/api/use-new-joincode"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Ghost, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
interface IntiveModalProps {
    open: boolean,
    setOpen:(open:boolean)=>void
    name:string,
    joinCode:string,
}
export default function IntiveModal({open,setOpen,name,joinCode}:IntiveModalProps) {
  const worksapceId = useWorkspaceId()
  const {mutate,isPending:isPendingNewJoinCode} = useNewJoinCode()
  const handleNewCode = ()=>{
    mutate({workspaceId:worksapceId},
        {
            onSuccess:()=>{
                toast.success("生成新的邀请码成功")
            },
            onError:(error)=>{
                toast.error("生成新的邀请码失败")
            }
        }
    )
  }
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${worksapceId}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => toast.success("复制成功"));
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>邀请人们到{name}</DialogTitle>
          <DialogDescription>
            使用邀请码来邀请人们加入你的工作区
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4 items-center justify-center py-10 ">
        <p className="text-4xl font-bold tracking-widest uppercase">
            {joinCode}
        </p>
        <Button onClick={handleCopy}
        variant="ghost"
        size="sm"
        >复制邀请链接</Button>
        </div>
        <div className="flex items-center justify-between w-full">
            <Button disabled={isPendingNewJoinCode} onClick={() => handleNewCode()} variant="outline">
                New Code
                <RefreshCcw></RefreshCcw>
            </Button>
            <DialogClose asChild>
                <Button disabled={isPendingNewJoinCode}>关闭</Button>
            </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}