

import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
const UserItemVariants = cva(
    "flex items-center gap-1.5 justify-start  rounded-md px-4 py-1.5 text-sm font-medium text-muted-foreground overflow-hidden hover:bg-muted",
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
interface UserItemProps {
    id:Id<"members">,
    label?:string,
    image?:string,
    variant?:VariantProps<typeof UserItemVariants>["variant"],
}
export default function UserItem({
    id,
    label="Member",
    image,
    variant
}:UserItemProps) { 
    const worksapceId = useWorkspaceId();
    const avatarFallback = label.charAt(0).toUpperCase();
  return (
    <Button
     variant='transparent'
     className={cn(UserItemVariants({variant:variant}))}
     size="sm"
     asChild
    >
        <Link href={`/worksapce/${worksapceId}/member/${id}`}>
            <Avatar className='size-5 rounded-md mr-1'>
                <AvatarImage className='rounded-md' src={image} ></AvatarImage>
                <AvatarFallback className='rounded-md bg-sky-500 text-white text-xs'>
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            <span className='text-sm truncate'>{label}</span>
        </Link>
    </Button>
  )
}
