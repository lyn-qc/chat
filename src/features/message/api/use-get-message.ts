import { api } from "../../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";


const BATCH_SIZE = 20;

interface UseGetMessageProps {
    channelId?: Id<"channels">;
    conversationId?: Id<"conversations">;
    parentMessageId?: Id<"messages">;
}

export type GetMessagesReturnType = typeof api.message.get._returnType["page"];

export const useGetMessage = ({ channelId, conversationId, parentMessageId }: UseGetMessageProps) => {
    const { results, status, loadMore } = usePaginatedQuery(
        api.message.get,
        { channelId, conversationId, parentMessageId },
        { initialNumItems: BATCH_SIZE }
    )
    return { results, status, loadMore: () => loadMore(BATCH_SIZE) }
}