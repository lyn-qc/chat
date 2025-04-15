
import React, { useState } from 'react'
import { useCreateChannelModel } from '../store/use-create-clannel-model'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateChannel } from '../api/use-create-channel'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useRouter } from 'next/navigation'

export default function CreateChannelModel() {
    const router = useRouter()
    const {mutate, isPending} = useCreateChannel()
    const [open, setOpen] = useCreateChannelModel()
    const [name,setName] = useState('')
    const workspaceId = useWorkspaceId()
    const handleClose = () => {
        setName("")
        setOpen(false)
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate(
            {name,workspaceId},
            {
                onSuccess: () =>{
                    router.push(`/workspace/${workspaceId}/channel/{id}`)
                    handleClose()
                }
            }
        )
        // handleClose()
    }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>Create Channel</DialogTitle>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
            <Input
             value={name}
             disabled={isPending}
             placeholder='Channel Name'
             required
             autoFocus
             minLength={3}
             maxLength={20}
             onChange={(e) => {
                setName(e.target.value)
             }
             }
            >
            </Input>
            <div className='flex justify-end'>
                <Button type='submit' disabled={isPending}>
                    Create
                </Button>
            </div>
        </form>
      </DialogContent>

    </Dialog>
  )
}
