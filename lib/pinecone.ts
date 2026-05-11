// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'
import { supabase } from './supabase';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateEmbeddings } from './gemini';

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Create a dense index with integrated embedding
const index = pc.Index(process.env.PINECONE_INDEX_NAME!);


export async function LoadToPinecone(filename:string) {
    try {
        // obtain pdf
        const {data, error} = await supabase.storage.from("documents").download(filename)
        if (error || !data) throw Error(error.message)

        const buffer = Buffer.from(await data.arrayBuffer())
        console.log("📄 CREATING PDF LOADER...")
        const loader = new PDFLoader(
        new Blob([buffer], { type: "application/pdf" })
        )

        const pages = await loader.load()

        // split into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await textSplitter.splitDocuments(pages)
        // create embedding from chunks
        const texts = splitDocs.map((doc) => doc.pageContent)

        const embeddings = await Promise.all(texts.map(async (text) => await generateEmbeddings(text)))
        // create vector object
        const vectors = splitDocs.map((doc, index) => ({
            id: `${filename}-${index}-${Date.now()}`,
            values: embeddings[index],
            metadata: {
                source: filename,
                page: doc.metadata.page,
                text: doc.pageContent,
                chunk: index,
            }
        }))
        // upload to pinecone
        const result = await index.namespace(filename).upsert({
        records: vectors,
        })
        console.log("EMBED SAMPLE:", embeddings[0]?.length)
        console.log("VECTOR SAMPLE:", vectors[0])

        return result
        
    } catch (error) {
        console.log("Error load pinecone", error)
        throw error
    }
}

export async function  deleteNamespace(fileName:string) {
    try {
        const result = await index.namespace(fileName).deleteAll()
        return result
    } catch (error) {
        console.log("Error delete namespace", error)
        throw error
    }
}

