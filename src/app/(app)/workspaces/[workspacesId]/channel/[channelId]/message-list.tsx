import Message from "@/components/message";
import { useCurrentMember } from "@/features/member/api/use-current-member";
import { GetMessagesReturnType } from "@/features/message/api/use-get-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "convex/_generated/dataModel";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Loader } from "lucide-react";
import { useState } from "react";

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreateTime?: number;
  variant?: "channel" | "thread" | "conversation"
  data: GetMessagesReturnType | undefined;
  loadMore?: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formateDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)
  if (isToday(date)) return "今天"
  if (isYesterday(date)) return "昨天"
  return format(date, 'yyyy年MM月dd日')
}

const TIME_THRESHOLD = 5

export default function MessageList({
  memberName,
  memberImage,
  channelName,
  channelCreateTime,
  variant = "channel",
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) {
  const groupMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime)
      const dateKey = format(date, 'yyyy-MM-dd')
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].unshift(message)
      return groups
    },
    {} as Record<string, typeof data>
  )

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)
  const workspaceId = useWorkspaceId()
  const { data: CurrentMember } = useCurrentMember({ workspaceId })
  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto message-scrollbar">
      {
        Object.entries(groupMessages || {}).map(([dateKey, messages]) => {
          return (
            <div key={dateKey}>
              <div className="text-center my-2 relative">
                <hr className="absolute top-1/2 right-0 border-t border-gray-300" />
                <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 text-gray-500 shadow-sm">
                  {formateDateLabel(dateKey)}
                </span>
              </div>
              {
                messages.map((message, index) => {
                  const prevMessage = messages[index - 1]
                  const isCompact =
                    prevMessage &&
                    prevMessage.user?._id === message.user._id &&
                    differenceInMinutes(
                      new Date(message._creationTime),
                      new Date(prevMessage._creationTime)
                    ) < TIME_THRESHOLD
                  return (
                    <Message
                      key={message._id}
                      id={message._id}
                      messageID={message.memberId}
                      authorName={message.user.name}
                      isAuthor={message.memberId === CurrentMember?._id}
                      authorImage={message.user.image}
                      reactions={message.reactions}
                      body={message.body}
                      image={message.image}
                      updateAt={message.updatedAt}
                      createdAt={message._creationTime}
                      isEditing={editingId === message._id}
                      setEditingId={setEditingId}
                      isCompact={isCompact}
                      hideThreadButton={variant === "thread"}
                      threadCount={message.threadCount}
                      threadImage={message.threadImage}
                      threadTimestamp={message.threadTimestamp}
                    >
                    </Message>
                  )
                })
              }

            </div>
          )
        })
      }
      <div
        style={{ height: "12px" }}
        className="flex-shrink-0"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore?.()
                }
              },
              { threshold: 0 }
            )
            observer.observe(el)
            return observer.disconnect()
          }
        }}
      />
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}
      <div className="h-6 flex-shrink-0">
      </div>
    </div>
  )
}
