'use client'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { useCreateWorkspaceModel } from "@/features/workspaces/store/use-create-workspace-model"
import { useCreateChannelModel } from "@/features/channel/store/use-create-clannel-model"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import React from 'react'

export default function WorkspaceSwitcher() {
    const router = useRouter()
    const worksapceId = useWorkspaceId()
    const [open, setOpen] = useCreateWorkspaceModel()
    const { data: worksapce, isLoading: worksapceLoading } = useGetWorkspace({ id: worksapceId })
    const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces()

    const filterWorksapces = workspaces?.filter((workspace) => workspace._id !== worksapceId)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    asChild
                    className="size-9 relative overflow-hidden bg-blue-50 hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl"
                >
                    <span>
                        {worksapceLoading ?
                            <Loader className="size-5 animate-spin shrink-0" /> :
                            worksapce?.name.charAt(0).toUpperCase()
                        }
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side='bottom' className="w-64">
                <DropdownMenuItem
                    className="cursor-pointer flex-col justify-start items-start capitalize"
                    onClick={() => { router.push(`/workspaces/${worksapceId}`) }}
                >
                    {worksapce?.name}
                    <span className="text-xs text-muted-foreground">
                        Active workspace
                    </span>
                </DropdownMenuItem>
                {
                    filterWorksapces?.map((workspacecur) => {
                        return (
                            <DropdownMenuItem
                                key={workspacecur._id}
                                className="cursor-pointer  capitalize overflow-hidden"
                                onClick={() => { router.push(`/workspaces/${workspacecur._id}`) }}
                            >
                                <div  className="size-9  overflow-hidden bg-[#6161ad] hover:bg-[#6161ad]/80 text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                                    {workspacecur?.name.charAt(0).toUpperCase()}
                                </div>
                                <p className="truncate">{workspacecur.name}</p>
                            </DropdownMenuItem>
                        )
                    })
                }
                <DropdownMenuItem className="cursor-pointer"
                    onClick={()=>setOpen(true)}
                >
                    <div className="size-9 relative overflow-hidden bg-[#eee] hover:bg-[#eee]/80 text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                        <Plus></Plus>
                    </div>
                    创建一个新的工作区
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
