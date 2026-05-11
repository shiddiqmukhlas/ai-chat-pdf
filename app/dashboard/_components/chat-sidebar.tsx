"use client"
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Chat } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, GripVertical } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChatSidebar() {
    const {data, isLoading} = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const res = await fetch("/api/chats")
            if (!res.ok) {
                throw new Error("Failed to fetch chats");
            }
            const data = await res.json()
            console.log("API RESPONSE:", data)
            return data
        }
    });
    const {id} = useParams()
    // const chats: Chat[] = Array.isArray(data) ? data : []
  return (
    <>
        <ResizablePanel defaultSize={20} minSize={12}>
            
            <div className="h-full bg-neutral-800 flex flex-col items-center">
                <div className="p-4 w-full">
                    <Link href="/dashboard" className="w-full">
                        <Button className="w-full border-2 border-neutral-300 border-dotted cursor-pointer">
                            <ArrowLeft/>
                            Upload PDF        
                        </Button>
                    </Link>
                </div>    

                <div className="w-full h-full overflow-y-auto p-4 flex-1">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="w-full h-8 mb-4" />
                        ))
                    ) : (
                        <div className="w-full flex flex-col gap-2">
                            {data.map((chat: Chat) => (
                                <Link 
                                    href={`/dashboard/chat/${chat.id}`} 
                                    key={chat.id} 
                                    className={cn("w-full truncate p-2 bg-neutral-700 rounded-lg hover:bg-neutral-700/40 text-neutral-200", {"bg-neutral-500": chat.id === id})}>
                                        {chat.fileName}
                                </Link>
                            ))}

                        </div>
                    )}
                </div>
            </div>

        </ResizablePanel>

        <div className="relative flex items-center justify-center w-2">
            <ResizableHandle className="absolute inset-0 bg-neutral-100" />

            <div className="pointer-events-none z-10 bg-neutral-100 p-1 rounded">
                <GripVertical className="w-5 h-5 text-neutral-500" />
            </div>
        </div>
    </>  
  )
}
