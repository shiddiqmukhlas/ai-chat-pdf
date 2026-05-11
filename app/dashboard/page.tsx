import FileUpload from '@/components/file-upload'
import { ResizablePanel } from '@/components/ui/resizable'
import React from 'react'

export default function Dashboard() {
  return (
    <ResizablePanel defaultSize={80} minSize={60} className='h-full grid place-items-center'>
      <div className='flex flex-col gap-8 text-center max-w-240 items-center'>
        <h1 className='text-4xl font-bold'>Chat with any PDF</h1>
        <p className='text-xl text-muted-foreground'>Turn tedious PDF into dynamic conversations. Ask questions, get instant summaries, and pinpoint information in seconds.
        </p>

        <div className='p-4 border-2 border-neutral-300/60 rounded-3xl shadow-lg shadow-neutral-100/60 w-1/2 aspect-video'>
          <FileUpload/>
        </div>
      </div>

    </ResizablePanel>
  )
}
