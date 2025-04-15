
import React, { useState } from 'react'
import { Doc } from '../../../../../convex/_generated/dataModel'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { ChevronDown, ListFilter, SquarePen } from 'lucide-react'
import { Hint } from '@/components/hint'
import PreferencesModal from './preferences-modal'
import IntiveModal from './intivemodal'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

interface WorkspaceHeaderProps {
  workspace:Doc<"workspaces">,
  isAdmin: boolean
}
export default function WorkspaceHeader({workspace,isAdmin}: WorkspaceHeaderProps) {
    const workspaceId = useWorkspaceId()
    const [open,setOpen] = useState(false)
    const [intiveOpen,setIntiveOpen] = useState(false)
    
    
  return (
    <>
    <IntiveModal open={intiveOpen} setOpen={setIntiveOpen}
      name={workspace?.name} joinCode={workspace?.joinCode}
    >
    </IntiveModal>
    <PreferencesModal  open={open} setOpen={setOpen} initialValue={workspace.name}/>
    <div className='flex items-center justify-between px-4 h-[49px] gap-0.5 w-full'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
             variant="ghost"
             className='font-semibold text-lg w-auto p-1.5 overflow-hidden' size="sm"
            >
                <span className='truncate text-gray-600'>{workspace?.name}</span>
                <ChevronDown className='size-4 ml-1 shrink-0'> </ChevronDown>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='w-64'>
         
               <DropdownMenuItem
            className='cursor-pointer capitalize'
            >
                <div className='size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center'>
                    {workspace?.name.charAt(0).toUpperCase()}
                </div>
                <div className='flex flex-col items-start'>
                    <p className='font-bold'>{workspace.name}</p>
                    <p className='text-xs text-muted-foreground'>Active worksapce</p>
                </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {
            isAdmin && <>
            <DropdownMenuItem
             className='cursor-pointer py-2'
             onClick={()=>{setIntiveOpen(true)}}
            >
                邀请到{workspace.name}
            </DropdownMenuItem>
            <DropdownMenuItem
             className='cursor-pointer py-2'
             onClick={()=>{setOpen(true)}}
            >
                偏好
            </DropdownMenuItem>
            </>
         }
        </DropdownMenuContent>
      </DropdownMenu>
      <div className='flex items-center gap-0.5'>
        <Hint label='过滤信息' side='bottom'>
        <Button variant="ghost" size="sm">
            <ListFilter className='size-4'></ListFilter>
         </Button>
        </Hint>
         
         <Hint label='新消息 ' side='bottom'>
            <Button variant="ghost" size="sm">
                <SquarePen className='size-4'></SquarePen>
            </Button>
         </Hint>
         
      </div>
    </div>
    </>
  )
}
