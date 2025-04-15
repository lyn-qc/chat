"use client"
import { Button } from '@/components/ui/button'
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspaceinfo'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import VerificationInput from 'react-verification-input'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useJoin } from '@/features/workspaces/api/usejoin'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function JoinPage() {
    const router = useRouter()
    const params = useParams()
    const workspaceId = params.worksapceId as Id<"workspaces">
    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId })
    const { mutate, isPending } = useJoin()
    const handleComplete = (value: string) => {
        mutate({ workspaceId, joinCode: value }, {
            onSuccess: (id) => {
                router.push(`/workspaces/${id}`)
                toast.success("加入成功")
            },
            onError: (error) => {
                toast.error("加入失败")
            }
        })
    }

    if (isLoading) {
        return (
            <div className='h-full flex flex-col items-center justify-center gap-y-8 bg-white p-8'>
                <Loader className='size-6 animate-spin text-muted-foreground'></Loader>
            </div>
        )
    }
    return (
        <div className='h-full flex flex-col items-center justify-center gap-y-8 bg-white p-8'>
            <div className='flex flex-col gap-y-8 items-center justify-center max-w-md'>
                <div className='flex flex-col items-center justify-center gap-y-2'>
                    <h1 className='text-2xl font-bold'>加入{data?.name}</h1>
                    <p className='text-md text-muted-foreground'>
                        输入工作区邀请码以加入工作区
                    </p>
                </div>
                <VerificationInput
                    onComplete={handleComplete}
                    classNames={{
                        container: cn("flex gap-x-6 round-md", isPending && "opacity-50 cursor-not-allowed"),
                        character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center  font-medium text-gray-300 text-lg"

                    }}
                    length={6}
                    autoFocus
                >
                </VerificationInput>
                <div className='flex  gap-y-4'>
                    <Button
                        size="lg"
                        variant="outline"
                        asChild
                    >
                        <Link href="/chat">
                            返回首页
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
