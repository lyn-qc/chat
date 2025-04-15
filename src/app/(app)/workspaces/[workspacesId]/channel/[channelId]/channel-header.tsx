import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
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
import { TrashIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useChannelId } from '@/hooks/use-channel-id'
import { useUpdateChannel } from '@/features/channel/api/use-update-channel'
import { toast } from 'sonner'
import { useConfirm } from '@/hooks/use-confirm'
import { useRemoveChannel } from '@/features/channel/api/use-remove-channel'
import { useRouter } from 'next/navigation'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCurrentMember } from '@/features/member/api/use-current-member'
interface ChannelHeaderProps {
    name: string
}
export default function ChannelHeader({name}: ChannelHeaderProps) {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm(
        "确认删除此频道",
        "删除频道后，将无法恢复"
    )
    const [editname,setEditname] = useState(name)
    const [open, setOpen] = useState(false)
    const channelId = useChannelId()
    const {data:member} = useCurrentMember({workspaceId})
    const {mutate:updateChannel,isPending:isUpdatingChannel} = useUpdateChannel()
    const {mutate:removeChannel,isPending:isRemovingChannel} = useRemoveChannel()

    const handleEditOpen = (value:boolean) => {
        if (member?.role !== "admin") {
            return
        }
        setOpen(value)
    }
    
    const handleUpdateSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateChannel({id:channelId,name:editname},{
            onSuccess:() =>{
                toast.success('频道名称修改成功')
                setOpen(false)
            },
            onError:(error) => {
                toast.error('频道名称修改失败')
            }
        })
    }

    const handleRemoveChannel =async () => {
        const ok = await confirm()
        if(!ok){
            return
        }
        removeChannel({id:channelId},{
            onSuccess:() =>{
                router.push(`/workspaces/${workspaceId}`)
                toast.success('频道删除成功')
                // router.push(`/workspaces/${workspaceId}/channels`)
            },
            onError:(error) =>{
                toast.error('频道删除失败')
            }
        })
    }
  return (
   
   
    <div className='bg-transparent border-b h-[49px] flex items-center px-4 overflow-hidden'>
        <ConfirmDialog></ConfirmDialog>
    <Dialog open={open} onOpenChange={handleEditOpen}>
        <DialogTrigger asChild>
            <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size="sm"
            >
                <span className='truncate'>{name}</span>
                <FaChevronDown className='size-2.5 ml-2'></FaChevronDown>
            </Button>
      </DialogTrigger>
      <DialogContent className='p-0 bg-gray-50 overflow-hidden' >
        <DialogHeader className='p-4 border-b bg-white'>
          <DialogTitle>
            {name}
          </DialogTitle>
        </DialogHeader>
        <div className='px-4 pb-4 flex flex-col gap-y-2'>
            <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-all duration-200'>
                <Dialog >
                    <DialogTrigger className='w-full'>
                        <div className='flex justify-between items-center w-full'>
                            <p className='text-sm font-semibold'>
                                Channel Name
                            </p>
                            <p className='text-sm text-[#1264a3] hover:underline font-semibold'>Edit</p>
                        </div>
                    </DialogTrigger>
             
                    <p className='text-sm'>{name}</p>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                修改频道名称
                            </DialogTitle>
                        </DialogHeader>
                        <form className='gap-y-4' onSubmit={handleUpdateSubmit}>
                            <Input
                             required
                             value={editname}
                             onChange={(e) => setEditname(e.target.value)}
                             placeholder='Channel Name'
                             className=''
                             autoFocus
                             minLength={3}
                             maxLength={20}
                             disabled={isUpdatingChannel}
                            >
                            </Input>
                            <DialogFooter className='mt-2'>
                                <DialogClose asChild>
                                    <Button disabled={isUpdatingChannel} variant="outline">关闭</Button>
                                </DialogClose>
                                <Button disabled={isUpdatingChannel} >保存</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
           <Button
            className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600 transition-all duration-200'
           onClick={handleRemoveChannel}
           disabled={isRemovingChannel}
           >
            <TrashIcon className='size-4'></TrashIcon>
            <p className='text-sm font-semibold'>Delete channel</p>
           </Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}
