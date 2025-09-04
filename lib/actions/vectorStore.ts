import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import prisma from "../prisma";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
});

export async function processFile(fileUrl: string, docId: string) {
  let loader;

  if (fileUrl.endsWith(".pdf")) {
    loader = new PDFLoader(fileUrl);
  } else {
    loader = new TextLoader(fileUrl);
  }

  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.splitDocuments(rawDocs);

  for (const doc of docs) {
    const vector = await embeddings.embedQuery(doc.pageContent);

    await prisma.chunk.create({
      data: {
        content: doc.pageContent,
        embedding: vector,
        documentId: docId,
      },
    });
  }

  return { chunks: docs.length };
}

//  Query against stored vectors
export async function queryIndex(query: string, docId: string) {
  const queryEmbedding = await embeddings.embedQuery(query);

  // pgvector cosine similarity query
  const results: { id: string; content: string; similarity: number }[] =
    await prisma.$queryRawUnsafe(
      `
      SELECT id, content, 1 - (embedding <=> $1) AS similarity
      FROM "Chunk"
      WHERE "documentId" = $2
      ORDER BY similarity DESC
      LIMIT 3
    `,
      queryEmbedding,
      docId
    );

  const context = results.map((r) => r.content).join("\n\n");

  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
  });

  const systemPrompt = `
  You are a helpful assistant that answers questions ONLY based on the provided context.

  Rules:
  - If the context does not contain the answer, reply with "I don’t know based on the document."
  - Do not make up information.
  - Respond clearly and concisely.
  `;

  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Context:\n${context}\n\nQuestion: ${query}` },
  ]);

  return response.content;
}
