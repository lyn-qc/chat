

import { Button } from '@/components/ui/button'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { IconType } from 'react-icons/lib'
import {cva ,type VariantProps} from 'class-variance-authority'
import { cn } from '@/lib/utils'
const sidebarItemVariants = cva(
    "flex items-center gap-1.5 justify-start  rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground overflow-hidden hover:bg-muted",
    {
        variants:{
            variant:{
                default:"text-[#000]",
                active:"text-[#000] bg-white/90 hover:bg-white/90"
            }
        },
        defaultVariants:{
            variant:"default"
        }
    }
)
interface SidebarItemProps {
    label:string,
    id:string,
    icon:LucideIcon|IconType,
    variant?:VariantProps<typeof sidebarItemVariants>["variant"];
}
export default function SidebarItem({
  label,
  id,
  icon: Icon,
  variant
}: SidebarItemProps) { 
    const workspaceId = useWorkspaceId();
  
  return (
    <Button
     variant={"ghost"}
     size={"sm"}
     asChild
     className={cn(sidebarItemVariants({variant}))}
    >
        <Link href={`/workspaces/${workspaceId}/channel/${id}`}>
        <Icon className='size-3.5 shrink-0 mr-1'></Icon>
        <span className='text-sm truncate items-center'>{label}</span>
        </Link>
    </Button>
  )
}
