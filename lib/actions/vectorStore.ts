import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import prisma from "../prisma";
import fetch from "node-fetch";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
});

export async function processFile(fileUrl: string, docId: string) {
  const res = await fetch(fileUrl);
  const buffer = Buffer.from(await res.arrayBuffer());

  let loader;
  if (fileUrl.endsWith(".pdf")) {
    loader = new PDFLoader(new Blob([buffer]), { splitPages: false });
  } else {
    loader = new TextLoader(new Blob([buffer]));
  }

  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.splitDocuments(rawDocs);

  const vectors = await embeddings.embedDocuments(
    docs.map((d) => d.pageContent)
  );

  for (let i = 0; i < docs.length; i++) {
    await prisma.chunk.create({
      data: {
        content: docs[i].pageContent,
        embedding: vectors[i],
        documentId: docId,
      },
    });
  }

  return { chunks: docs.length };
}

export async function queryIndex(query: string, docId: string) {
  const queryEmbedding = await embeddings.embedQuery(query);

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

  if (results.length === 0) {
    return "No matching chunks found in this document.";
  }

  const context = results.map((r) => r.content).join("\n\n");

  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
  });

  const response = await llm.invoke([
    { role: "system", content: `Answer only from context: ${context}` },
    { role: "user", content: query },
  ]);

  return response.content;
}
