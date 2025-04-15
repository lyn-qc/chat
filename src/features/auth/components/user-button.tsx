'use client'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { Loader, LogOut } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"
export const UserButton = () => {
    const { data, isLoading } = useCurrentUser()
    const {signOut} = useAuthActions()
    if (isLoading) {
        return <Loader className="size-4 animate-spin text-muted-foreground"></Loader>
    }
    if(!data){
        return null
    }
    const { name, email,image } = data
    const avatarFallback = name!.charAt(0).toUpperCase()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="">
                <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage alt={name} src={image}></AvatarImage>
                    <AvatarFallback className="bg-sky-500 text-white">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={()=> signOut()}>
                    <LogOut></LogOut>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}