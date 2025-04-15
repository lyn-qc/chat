import React, { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Quill from 'quill'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCreateMessage } from '@/features/message/api/use-create-message'
import { toast } from 'sonner'
import { Id } from 'convex/_generated/dataModel'
import { useGenerateUpload } from '@/features/upload/api/use-generate-upload-url'

type createMessageValues = {
  channelId: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  body: string;
  image?: Id<'_storage'> | undefined;
}

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })
export default function ChatInput() {
  const editorRef = useRef<Quill | null>(null)
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()
  const [ispending, setIsPending] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const { mutate: generateUpload } = useGenerateUpload()
  const { mutate: createMessage } = useCreateMessage()
  const handleSubmit = async ({
    body,
    image
  }: {
    body: string,
    image: File | null;
  }) => {
    try {
      setIsPending(true)
      editorRef.current?.enable(false)
      const values: createMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined
      }
      if (image) {
        const url = await generateUpload({}, { throwError: true })
        if (!url) {
          throw new Error('上传失败')
        }
        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image
        })
        if (!result.ok) {
          throw new Error('上传失败')
        }
        const {storageId} = await result.json()
        values.image = storageId
      }
      await createMessage(values, { throwError: true })

      editorRef.current?.enable(true)
    } catch (err) {
      toast.error('消息发送失败')
    } finally {
      setIsPending(false)
      setEditorKey(prvekey => prvekey + 1)
    }
  }
  return (
    <div className='px-5 w-full'>
      <Editor
        key={editorKey}
        // @ts-ignore
        editorRef={editorRef}
        onSubmit={handleSubmit}
        disabled={ispending}
        innerRef={editorRef}

      />
    </div>
  )
}
