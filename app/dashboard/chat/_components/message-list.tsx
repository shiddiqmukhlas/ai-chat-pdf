import { Message, MessageRole } from "@prisma/client"
import clsx from "clsx"
import { use, useEffect } from "react"

type Props = {
    messages: Message[]
    isSending: boolean,
    isLoading: boolean
} 
export default function MessageList({messages, isSending, isLoading}: Props) {

    useEffect(() => {
        const messageList = document.getElementById("message-list")
        if (messageList) {
            messageList.scrollTo({
                top: messageList.scrollHeight,
                behavior: "smooth"
            }) 
        }
    }, [messages, isLoading])
  return (
    <div id="message-list" className='flex-1 flex flex-col gap-2 p-4 overflow-auto'>{isLoading && <p>Loading...</p>}
    {messages.map((messages) => (
        <div key={messages.id} className={clsx("text-sm p-2 bg-neutral-100 rounded-lg", messages.role === MessageRole.USER ? "self-end bg-neutral-100" : "self-start bg-neutral-50 border-neutral-300 border")}>{messages.content}</div>))}
        {isSending && <p className="text-sm p-2 rounded-lg self-start border border-neutral-300">Retrieving...</p>}
    </div>
  )
}
