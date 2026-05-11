import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth()

        if(!userId) {
            return new Response("Unauthorized", { status: 401 })
        }

        const userChat = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
            include: {
                chats: {
                    orderBy: {
                        uploadedAt: "desc",
                    }
                }
            }
        })

        
        return NextResponse.json(userChat?.chats ?? [], { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json("Error fetch", { status: 500 })        
    }
}