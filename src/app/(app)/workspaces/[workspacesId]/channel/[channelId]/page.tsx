"use client"
import { useGetChannel } from '@/features/channel/api/use-get-channel'

import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { AlertTriangle, Loader, TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import ChannelHeader from './channel-header'
import ChatInput from './chat-input'
import { useGetMessage } from '@/features/message/api/use-get-message'
import MessageList from './message-list'

export default function ChannelPage() {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    
    const channelId = useChannelId()
    const {results,status,loadMore} = useGetMessage({channelId})
    
    const {data:channel,isLoading: channelLoading} = useGetChannel({id:channelId})
    if (channelLoading || status === "LoadingFirstPage") {
       return (
         <div className='flex flex-col bg-blue-50 h-full items-center justify-center'>
           <Loader className='size-5 aniamte-spin text-aqua-500'></Loader>
         </div>
       )
     }
     if (!channel) {
       return (
         <div className='flex flex-col gap-y-2 bg-blue-50 h-full items-center justify-center'>
           <AlertTriangle className='size-5 text-white'></AlertTriangle>
           <p className='text-white text-sm'>未找到频道</p>
         </div>
       )
     }
  return (
    <div className='flex flex-col h-full bg-gradient-to-br from-[rgb(250,244,255)] to-[rgb(221,235,255)]'>
      <ChannelHeader name={channel.name} />
        <MessageList
         channelName={channel.name}
         channelCreateTime={channel._creationTime}
         data={results}
         loadMore={loadMore}
         isLoadingMore={status === "LoadingMore"}
         canLoadMore = {status === "CanLoadMore"}
        >

        </MessageList>
        <ChatInput></ChatInput>
    </div>
  )
}
