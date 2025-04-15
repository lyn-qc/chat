'use client'
import { CreateWorkspaceModal } from "./create-workspaces-model";
import { useEffect, useState } from "react";
import CreateChannelModel from "@/features/channel/components/create-channel-model"
export const Modals = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    },[])
    if (!mounted) {
        return 
    }
    return (
        <>
            <CreateChannelModel />
            <CreateWorkspaceModal />
        </>
    )
}
