"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Inbox, Loader } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

export default function FileUpload() {
    const queryClient = useQueryClient()
    const {getRootProps, getInputProps} = useDropzone({
    accept: {
        "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (file) => {
        mutation.mutate(file[0])
    },
    })

    const mutation = useMutation({
        mutationFn: async(file:File) => {
            const formData = new FormData()
            formData.append("file", file)
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            if (!res.ok) {
                throw new Error("File upload failed")
            }
            return await res.json()
        },
        onSuccess: () => {
            toast.success("File uploaded successfully")
            queryClient.invalidateQueries({queryKey:["chats"]})
        },
        onError: () => {
            toast.error("File upload failed")
        },
    })
  
    return (
        <div {...getRootProps()} className="bg-neutral-100 w-full h-full border-dashed border-2 border-neutral-300 flex flex-col items-center justify-center rounded-xl hover:bg-neutral-100/60 cursor-pointer">
            <input {...getInputProps()} disabled={mutation.isPending} accept="application/pdf"/>
            <>
                {mutation.isPending ? (
                    <Loader className="w-10 h-10 animate-spin"/>
                ) : (
                    <Inbox className="w-10 h-10 text-purple-400"/>
                )}
                <p className="text-sm text-muted-foreground">{mutation.isPending ? "Uploading..." : "Drag and drop your PDF here."}</p>
            </>
        </div>
    )
}
