import { deleteNamespace } from "@/lib/pinecone";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest, {params}:{params: Promise<{id:string}>}) {
    
    try {
        const {id} = await params
        const chat = await prisma.chat.findUnique({
            where: {
                id
            },
        })
        return NextResponse.json(chat, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json("Error fetch chat", { status: 500 })
    }
}

export async function DELETE(request:NextRequest, {params}:{params: Promise<{id:string}>}) {
    try {
        const {id} = await params
        const chat = await prisma.chat.delete({
            where: {
                id
            },
        })

        await supabase.storage.from("documents").remove([chat.fileName])
        await deleteNamespace(chat.fileName)

        return NextResponse.json(chat, {
            status: 200
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json("Error delete chat", { status: 500 })
    }
}