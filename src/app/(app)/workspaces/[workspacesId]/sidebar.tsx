import { UserButton } from '@/features/auth/components/user-button'
import React from 'react'
import WorkspaceSwitcher from './workspace-switcher'
import { SidebarButton } from './siber-button'
import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const pathname = usePathname()
  return (
    <aside className='w-[70px] h-full bg-[rgb(0,153,255)] flex flex-col items-center gap-y-4 pt-[9px] pb-4'>
        
        <WorkspaceSwitcher></WorkspaceSwitcher>
        <SidebarButton icon={Home} label='主页' isActive={pathname.includes('/workspace')}></SidebarButton>
        <SidebarButton icon={MessageSquare} label='消息' isActive={false}></SidebarButton>
        <SidebarButton icon={Bell} label='活动' isActive={false}></SidebarButton>
        <SidebarButton icon={MoreHorizontal} label='更多' isActive={false}></SidebarButton>
        <div className='flex flex-col gap-y-1 justify-center items-center mt-auto'>
            <UserButton></UserButton>
        </div>
    </aside>
  )
}
