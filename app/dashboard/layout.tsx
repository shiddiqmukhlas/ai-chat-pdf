"use client"
import { ResizablePanelGroup } from '@/components/ui/resizable';
import { useMediaQuery } from '@/hooks/use-media-query'
import { ReactNode } from 'react'
import ChatSidebar from './_components/chat-sidebar';

export default function DashboardLayout({children}:{children: ReactNode}) {
   
    const isMobile = useMediaQuery("(max-width: 768px)");
    return <div className='h-[calc(100vh-4rem)]'>
        <ResizablePanelGroup orientation={isMobile ? "vertical" : "horizontal"}> 
            <ChatSidebar/>
            {children}
        </ResizablePanelGroup>
    </div>
  
}
 