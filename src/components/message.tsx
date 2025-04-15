import { Doc, Id } from "convex/_generated/dataModel"
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { format, set } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Thumbnail from "./thumbnail";
import Toolbar from "./toolbar";
import { useUpdateMessage } from "@/features/message/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/message/api/use-delete-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reactions";
import usePanel from "@/hooks/use-panel";

const Renderer = dynamic(() => import("@/components/renderder"), { ssr: false });
// const Edtior = dynamic(() => import("@/components/editor"), { ssr: false });
interface MessageProps {
  id: Id<"messages">;
  messageID: Id<"members">;
  authorName?: string
  isAuthor: boolean
  authorImage?: string
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];

  image: string | null | undefined
  updateAt: Doc<"messages">["updatedAt"]
  createdAt: Doc<"messages">["_creationTime"]
  isEditing: boolean
  setEditingId: (id: Id<"messages"> | null) => void
  isCompact?: boolean
  hideThreadButton?: boolean
  threadCount?: number
  threadImage?: string
  threadTimestamp?: number
}

export default function Message({
  id,
  messageID,
  authorName = "Member",
  isAuthor,
  authorImage,
  reactions,
  body,
  image,
  updateAt,
  createdAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp
}: MessageProps) {
  const [ConfirmDialog, confirm] = useConfirm(
    "删除消息",
    "确定要删除这条消息吗？"
  )

  const avatarFallback = authorName.charAt(0).toUpperCase();
  const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage()
  const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage()
  const {mutate: toggleReaction, isPending: isUpdatingReaction} = useToggleReaction()
  const isPending = isUpdatingMessage

  
  const isWithin5Minutes = Date.now() - new Date(createdAt).getTime() < 300_000; // 5分钟 = 300,000毫秒

  const {parentMessageId,onOpenMessage,onCloseMessage} = usePanel()
  const handleupdate = ({ body }: { body: string }) => {
    updateMessage({ id, body }, {
      onSuccess: () => {
        toast.success("消息更新")
        setEditingId(null)
      },
      onError: () => {
        toast.error("消息更新失败")
      }
    })
  }

  const handleReaction = (value: string) => {
    toggleReaction({ messageId:id, value }, {
      onSuccess: () => {
        toast.success("消息更新")
      },
      onError: (error) => {
        console.log(error);
        
        toast.error("消息更新失败")
      }
    })
  }

  const handleDelete = async () => {
    const ok = await confirm()
    if (!ok) {
      return
    }
    removeMessage({ id }, {
      onSuccess: () => {
        if (parentMessageId===id) {
          onCloseMessage()
        }
        toast.success("消息删除成功")
      },
      onError: (error) => {
        toast.error("消息删除失败")
      }
    })
  }
  if (isCompact) {
    return (
      <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-blue-500 hover:bg-blue-200",
        isRemovingMessage && "bg-red-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
      )} >
        <ConfirmDialog></ConfirmDialog>
        <div className="flex items-start gap-2">
          <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[26px] leading-[22px] hover:underline">
            {format(new Date(createdAt), "HH:mm")}
          </button>
          <div className="flex flex-col w-full">
            <Renderer value={body}></Renderer>
            <Thumbnail url={image}></Thumbnail>
            {
              updateAt ? (
                <span className="text-xs text-muted-foreground">
                  (edited)
                </span>
              ) : null
            }
            <Reactions data={reactions} onChange={handleReaction} />
          </div>
        </div>
        {
          !isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => { setEditingId(id) }}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
              isDeleteDisabled={!isWithin5Minutes}
            >
            </Toolbar>
          )
        }
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
      isEditing && "bg-blue-500 hover:bg-blue-200",
      isRemovingMessage && "bg-red-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
    )} >
      <ConfirmDialog></ConfirmDialog>
      <div className="flex items-start gap-2">
        <button className="w-[30px] h-[30px] overflow-hidden rounded-full relative">
          <Avatar className='size-5 rounded-md mr-1'>
            <AvatarImage className='rounded-md' src={authorImage} ></AvatarImage>
            <AvatarFallback className='rounded-md bg-sky-500 text-white text-xs'>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm">
            <button
              onClick={() => { }}
              className="font-bold text-primary hover:underline"
            >
              {authorName}
            </button>
            <span>&nbsp;&nbsp;</span>
            <button className="text-xs text-muted-foreground hover:underline">
              {format(new Date(createdAt), "HH:mm")}
            </button>
          </div>
          <Renderer value={body} />
          <Thumbnail url={image}></Thumbnail>
          <Reactions data={reactions} onChange={handleReaction} />
        </div>
      </div>
      {
        !isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => { setEditingId(id) }}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
            isDeleteDisabled={!isWithin5Minutes}
          >

          </Toolbar>
        )
      }
    </div>
  )
}
