'use client'
interface workspaceIdLayoutProps{
    children: React.ReactNode;
}
import React from 'react'
import Toolbar from './toolbar';
import Sidebar from './sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Workspacesiberbar from './workspacesiberbar';
import usePanel from '@/hooks/use-panel';
import { Loader } from 'lucide-react';
import { Id } from 'convex/_generated/dataModel';
import Thread from '@/features/message/component/thread';

export default function WorkspacesIdLayout({children}: workspaceIdLayoutProps) {
    const {parentMessageId,onCloseMessage} = usePanel()
    const showPanel = !!parentMessageId
  return (
    <div>
        <Toolbar></Toolbar>
        <div className='flex h-[calc(100vh-40px)]'>
            <Sidebar></Sidebar>
            <ResizablePanelGroup direction='horizontal'
            autoSaveId="ca-workspace-layout"
            >
                <ResizablePanel
                 defaultSize={20}
                 minSize={10}
                 className='bg-amber-200'
                >
                   <Workspacesiberbar></Workspacesiberbar>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel minSize={50}>
                    {children}
                </ResizablePanel>
                {
                    showPanel && <>
                        <ResizableHandle withHandle/>
                        <ResizablePanel minSize={20} defaultSize={30}>
                        {
                            parentMessageId ? (
                                <Thread
                                 messageId= {parentMessageId as Id<"messages">}
                                 onClose={onCloseMessage}
                                />
                            ):(
                                <div className='flex h-full items-center justify-center'>
                                    <Loader className='size-5 animate-spin text-muted-foreground'></Loader>
                                </div>
                            )
                        }
                    </ResizablePanel>
                    </>
                }
            </ResizablePanelGroup>
            
        </div>
        
    </div>
  )
}
