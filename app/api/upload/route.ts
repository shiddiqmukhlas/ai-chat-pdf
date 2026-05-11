import { LoadToPinecone } from "@/lib/pinecone";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function  POST(request:NextRequest) {
    try {
        // authenticate user
        const {userId} = await auth()

        if(!userId) {
            return NextResponse.json({ message: "user not authenticated" }, { status: 401 })
        }
        // parse from data
        const formData = await request.formData()
        const file = formData.get("file")
        // validate file
        if(!file){
            return NextResponse.json({ message: "no file uploaded" }, { status: 400 })
        }

        if(!(file instanceof Blob)) {
            return NextResponse.json({ message: "invalid file type" }, { status: 400 })
        }
        // extract file details
        const fileSize = file.size
        const mimeType = file.type

        const originalFilename = file.name
        const fileName = `${originalFilename}-${Date.now()}`
        const bucketName = "documents"
        // upload file to supabase
        const {error} = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
                contentType: file.type
            })
        console.log("☁️ SUPABASE UPLOAD ERROR:", error)
        console.log("☁️ SUPABASE FILE NAME:", fileName)    
        if (error) {
            return NextResponse.json({ message: "file upload failed" }, { status: 500 })
        }
        const {data: publicUrlData} = await supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName)
            console.log(publicUrlData)
        // upload to pinecone
        await LoadToPinecone(fileName)
        // save document data to prisma / supabase
        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })
        if(!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }
        await prisma.chat.create({
            data: {
                fileName,
                fileSize,
                mimeType,
                fileUrl: publicUrlData?.publicUrl,
                userId: user.id
            }
        })

        return NextResponse.json({ 
            message: "file uploaded successfully",
            publicUrl: publicUrlData?.publicUrl
         }, 
         { status: 200 })


    } catch (error) {
        console.error("UPLOAD ERROR:", error)
        return NextResponse.json(error, { status: 500 })    
    }
}