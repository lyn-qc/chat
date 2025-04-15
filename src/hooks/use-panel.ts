import { useParentMessageId } from "@/features/message/store/use-parent-message-id"



export default function usePanel() {
  const [parentMessageId,setParentMessageId] = useParentMessageId()
  const onOpenMessage = (messageId:string) => {
    setParentMessageId(messageId)
  }
  const onCloseMessage = () => {
    setParentMessageId('')
  }
  
  return {
    parentMessageId,
    onOpenMessage,
    onCloseMessage
  }
}
