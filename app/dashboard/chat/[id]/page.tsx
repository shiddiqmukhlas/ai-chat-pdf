"use client"
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { Chat } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GripVertical, Loader, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { use } from 'react'
import { toast } from 'sonner'
import ChatContainer from '../_components/chat-container'

export default function DetailChat() {
    const {id} = useParams()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {data, isLoading, isError} = useQuery({
        queryKey: ["chats", id],
        queryFn: async ():Promise<Chat> => {
            const res = await fetch(`/api/chats/${id}`)
            if (!res.ok) {
                throw new Error("Failed to fetch chats");
            }
            const data = await res.json()
            console.log("API RESPONSE:", data)
            return data
        }})
    const mutation = useMutation({
        mutationFn: async() => {
            const res = await fetch(`/api/chats/${id}`, {method: "DELETE"})
            if (!res.ok) {
                throw new Error("Failed to delete chat");
            }
            return await res.json()
        },
        onSuccess: () => {
            toast.success("Chat deleted successfully")
            queryClient.invalidateQueries({queryKey:["chats"]})
            router.push("/dashboard")
        },
        onError: () => {
            toast.error("Failed to delete chat")
        }
    })
    
    if(isError) return <div>error</div>
  return (
    <>
        <ResizablePanel defaultSize={50} className='h-full' minSize={30}>
            {isLoading? <p>Loading...</p> : (
                <div className='h-full'>
                    <div className='flex flex-row justify-between px-4 py-2 gap-4 items-center'>
                        <p className='font-semibold'>{data?.fileName}</p>
                        <Button 
                            disabled={mutation.isPending}
                            onClick={() => mutation.mutate()} 
                            size={"icon"} 
                            variant={"destructive"}>
                            {mutation.isPending? <Loader className='animate-spin'/> : <Trash/>}
                        </Button>
                    </div>

                    <iframe src={`${data?.fileUrl}#view=FitH`} className='w-full h-full'/>
                </div>
            )}
        </ResizablePanel>

        <div className="relative flex items-center justify-center w-2">
            <ResizableHandle className="absolute inset-0 bg-neutral-100" />

            <div className="pointer-events-none z-10 bg-neutral-100 p-1 rounded">
                <GripVertical className="w-5 h-5 text-neutral-500" />
            </div>
        </div>

        <ResizablePanel defaultSize={30} minSize={20}>
            <ChatContainer fileName={data?.fileName as string} chatId={id as string}/>
        </ResizablePanel>
    </>
  )
}
