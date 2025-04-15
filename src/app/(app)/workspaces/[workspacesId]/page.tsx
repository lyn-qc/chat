"use client"
import { useGetChannels } from '@/features/channel/api/use-get-channels'
import { useCreateChannelModel } from '@/features/channel/store/use-create-clannel-model'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Loader, TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'

export default function ChannelPage() {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const [open, setOpen] = useCreateChannelModel()
    const {data: workspace,isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId})
    const {data:channel,isLoading: channelLoading} = useGetChannels({
        workspaceId
    })
    const channelId = useMemo(()=> channel?.[0]?._id, [channel])
    useEffect(()=>{
        if (workspaceLoading|| channelLoading || !workspace) return
        if (channelId) {
            router.push(`/workspaces/${workspaceId}/channel/${channelId}`)
        } else if(!open) {
            setOpen(true)
        }
    },[
        channelId,
        workspaceLoading,
        channelLoading,
        workspace,
        open,
        setOpen,
        router,
        workspaceId
    ])
    if (workspaceLoading || channelLoading) {
        // TODO: Loading    
        return(
            <div className="h-full flex-1 flex flex-col items-center justify-center gap-2">
                <Loader className='size-6 animate-spin text-muted-foreground'></Loader>
            </div>
        )
    }
    if (!workspace) {
        return(
            <div className="h-full flex-1 flex flex-col items-center justify-center gap-2">
                <TriangleAlert className='size-6 animate-spin text-muted-foreground'></TriangleAlert>
                <span className=''>
                    未找到工作区
                </span>
            </div>
        )
    }
  return null
}

