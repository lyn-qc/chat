import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";

type RequestType = {id:Id<"workspaces">, name:string}
type ResponseType = Id<"workspaces"> 

type Options = {
    onSuccess?:(data:ResponseType)=>void;
    onError?:(error:Error)=>void;
    onSettled?:()=>void;
    throwError?:boolean;
}
export const useUpdateWorkspaces = () => {
    const [data, setData] = useState<ResponseType | null>(null)
    const [error, setError] = useState<Error | null>(null)
 

    const [status, setStatus] = useState<'success'| 'error'|'settled'|"pending"|null>(null)
    const isPending = useMemo(() => status === 'pending', [status])
    const isSuccess = useMemo(() => status === 'success', [status])
    const isError = useMemo(() => status === 'error', [status])
    const isSettled = useMemo(() => status === 'settled', [status])
    const mutation = useMutation(api.workspaces.update)
    const mutate = useCallback(async(values: RequestType, options?: Options) =>{
        try{
            setData(null)
            setStatus('pending')
            const response = await mutation(values)
            if (response !== null) {
                setData(response);
                options?.onSuccess?.(response);
            } else {
                options?.onError?.(new Error("Response is null"));
            }
        } catch(error){
            setStatus("error")
            options?.onError?.(error as Error)
            if (options?.throwError) {
                throw error
            }
        } finally{
            setStatus('settled')
            options?.onSettled?.()
        }
    },[])
    return {
        mutate,
        data,
        error,
        isPending,
        isSuccess,
        isError,
        isSettled
    }
}