import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "models/gemini-embedding-001",
  apiKey: process.env.GOOGLE_API_KEY,
});

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
})

export async function generateEmbeddings(text:string):Promise<number[]>{
  return  await embeddings.embedQuery(text)
  
}

// 🔥 TEST DI SINI
async function testEmbedding() {
  const test = await embeddings.embedQuery("hello");
  console.log("DIM:", test.length);
}

// jalankan sekali saat file ke-load
testEmbedding();