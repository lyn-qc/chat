'use client'
import React from "react"
import { UserButton } from "@/features/auth/components/user-button"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { useEffect, useMemo } from "react"
import { useCreateWorkspaceModel } from "@/features/workspaces/store/use-create-workspace-model"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const { data, isLoading } = useGetWorkspaces()
  const workspacesId = useMemo(() => data?.[0]?._id, [data])
  const [open, setOpen] = useCreateWorkspaceModel()
  useEffect(() => {
    if (isLoading) {
      return
    }
    if (workspacesId) {
      router.push(`/workspaces/${workspacesId}`)
    }
    else {
      setOpen(true)
    }
  }, [isLoading, workspacesId, open, setOpen])
  return (

    <div className="h-[100vh]">
      <UserButton></UserButton>
    </div>
  )
}
