# 📄 Zahra AI PDF — Chat with any PDF

> Upload any PDF and have an intelligent AI-powered conversation with its content. Ask questions, get instant summaries, and find information in seconds.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

- 📤 **Drag & Drop PDF Upload** — Upload PDF files with a simple drag-and-drop interface
- 🤖 **AI-Powered Chat** — Ask questions about your PDF and get intelligent responses powered by Google Gemini via LangChain
- 🔍 **Vector Similarity Search** — Uses Pinecone to store and retrieve relevant PDF chunks for accurate, context-aware answers
- 🔐 **Authentication** — Secure user authentication and session management with Clerk
- 💾 **Persistent Chat History** — All chats and messages are stored per-user in a PostgreSQL database (via Supabase)
- 📱 **Resizable Panel Layout** — Split-panel UI with a collapsible sidebar listing all your PDF chats
- ⚡ **Optimistic UI Updates** — Messages appear instantly in the UI before the server confirms

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=pinecone&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)

---

## 📁 Project Structure

```
zahra-ai-pdf/
├── app/
│   ├── (home)/           # Landing page
│   ├── api/
│   │   ├── chats/        # GET user chats
│   │   ├── message/      # GET, POST messages + AI response
│   │   ├── upload/       # POST: upload PDF, parse & embed to Pinecone
│   │   └── webhooks/     # Clerk webhook for user sync
│   └── dashboard/
│       ├── _components/  # ChatSidebar
│       ├── chat/[id]/    # Individual chat page
│       └── page.tsx      # Upload page
├── components/
│   ├── file-upload.tsx   # Drag & drop PDF uploader
│   ├── header.tsx        # App header
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── prisma/
│   └── schema.prisma     # DB schema (User, Chat, Message)
├── middleware.ts          # Clerk auth middleware
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Supabase](https://supabase.com))
- A [Clerk](https://clerk.com) account
- A [Pinecone](https://pinecone.io) account
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)

### 1. Clone the repository

```bash
git clone https://github.com/shiddiqmukhlas/ai-chat-pdf.git
cd ai-chat-pdf
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

```env
# Database (PostgreSQL via Supabase)
DATABASE_URL=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=

# Google Gemini (via AI Studio)
GOOGLE_API_KEY=

# Pinecone Vector Store
PINECONE_API_KEY=
PINECONE_INDEX_NAME=

# Supabase (for file storage)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 4. Set up the database

```bash
npm run db:generate
npm run db:push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 How It Works

```
User uploads PDF
     │
     ▼
PDF is parsed & split into chunks
     │
     ▼
Chunks are embedded (Google Gemini) and stored in Pinecone
     │
     ▼
User asks a question in the chat
     │
     ▼
Relevant chunks are retrieved from Pinecone (similarity search)
     │
     ▼
Context + question sent to Gemini LLM → AI response
     │
     ▼
Response saved to PostgreSQL & displayed in UI
```

---

## 📜 Database Schema

```prisma
model User {
  id      String  @id @default(uuid())
  clerkId String  @unique
  email   String  @unique
  name    String?
  chats   Chat[]
  messages Message[]
}

model Chat {
  id         String   @id @default(uuid())
  fileName   String
  fileSize   Int
  mimeType   String
  fileUrl    String
  uploadedAt DateTime @default(now())
  userId     String
  message    Message[]
}

model Message {
  id        String      @id @default(uuid())
  role      MessageRole  // USER | SYSTEM
  content   String
  chatId    String
  userId    String
  createdAt DateTime    @default(now())
}
```

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |

---

## 📄 License

This project is for educational/personal use. Feel free to fork and build on top of it!
