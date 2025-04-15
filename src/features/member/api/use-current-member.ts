import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";


interface UseCurrentMember {
    workspaceId:Id<"workspaces">   
}

export const useCurrentMember = ({workspaceId}:UseCurrentMember) => {
    const data = useQuery(api.members.current,{workspaceId})
    const isLoading = data === undefined
    return {data,isLoading}
}