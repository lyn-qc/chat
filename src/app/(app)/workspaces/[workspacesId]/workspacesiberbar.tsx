import { useCurrentMember } from '@/features/member/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { AlertTriangle, Hash, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react'
import React, { useEffect } from 'react'
import WorkspaceHeader from './workspace-header'
import Sidebar from './sidebar'
import SidebarItem from './sidebar-item'
import { useGetChannels } from '@/features/channel/api/use-get-channels'
import WorkspaceSection from './workspace-section'
import { UseGetMembers } from '@/features/member/api/use-get-members'
import UserItem from './useritem'
import { useCreateChannelModel } from '@/features/channel/store/use-create-clannel-model'
import { useChannelId } from '@/hooks/use-channel-id'

export default function Workspacesiberbar() {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
  const {data: channel, isLoading: channelLoading } = useGetChannels({ workspaceId })
  const {data: members, isLoading: membersLoading} = UseGetMembers({ workspaceId })
  
  const [_open,setOpen] = useCreateChannelModel()
  if (memberLoading || workspaceLoading) {
    return (
      <div className='flex flex-col bg-blue-50 h-full items-center justify-center'>
        <Loader className='size-5 aniamte-spin text-white'></Loader>
      </div>
    )
  }
  if (!workspace || !member) {
    return (
      <div className='flex flex-col gap-y-2 bg-blue-50 h-full items-center justify-center'>
        <AlertTriangle className='size-5 text-white'></AlertTriangle>
        <p className='text-white text-sm'>未找到工作区</p>
      </div>
    )
  }
  return (
    <div className='flex flex-col bg-blue-50 h-full w-full items-center'>
      <WorkspaceHeader workspace={workspace} isAdmin={member.role == "admin"}></WorkspaceHeader>
      <div className='flex flex-col items-start bg-blue-50 px-6 h-full w-full'>
        <SidebarItem
            label="Threads"
            icon={MessageSquareText}
            id="threads"
          >
          </SidebarItem>
          <SidebarItem 
            label='Drafts & Send'
            icon={SendHorizonal}
            id="drafts"
          />
          <WorkspaceSection
           label="频道"
           hint="新的频道"
           onNew= {member.role=="admin"?()=>setOpen(true):undefined}
          >
            {
              channel?.map((item) => {
                return <SidebarItem key={item._id} label={item.name} icon={HashIcon} id={item._id} 
                  variant={channelId == item._id ? "active" : "default"}
                />
              })
            }
          </WorkspaceSection>
          <WorkspaceSection
           label="消息"
           hint="新消息"
           onNew= {()=>{}}
           >
          {
            members?.map((item) => {
              return (
                <UserItem key={item._id} label={item.user.name} image={item.user.image}
                  id={item._id}
                />
              )
            })
          }
          </WorkspaceSection>
      </div>
    </div>
  )
}
