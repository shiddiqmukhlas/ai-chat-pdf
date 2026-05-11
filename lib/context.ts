import { Pinecone } from "@pinecone-database/pinecone";
import { generateEmbeddings } from "./gemini";

export async function getFromEmbeddings(embeddings: number[], fileName:string) {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pc.Index(process.env.PINECONE_INDEX_NAME!).namespace(fileName)
    

    try {
        const queryResult = await index.query({
            vector: embeddings,
            topK: 5,
            includeValues: true,
            includeMetadata: true
        })
        return queryResult.matches || []
    } catch (error) {
        throw error
    }

}

export async function getContext(query:string, fileName:string) {
    const embeddings = await generateEmbeddings(query)
    const context = await getFromEmbeddings(embeddings, fileName)
    
    const filteredText = context.filter((match) => match.score && match.score > 0.5)

    const docs = filteredText.map(doc=>doc?.metadata?.text)
    return docs
    
}