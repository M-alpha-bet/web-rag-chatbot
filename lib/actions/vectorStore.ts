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

  for (const doc of docs) {
    const vector = await embeddings.embedQuery(doc.pageContent);

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "Chunk" (id, content, embedding, "documentId")
      VALUES (gen_random_uuid(), $1, $2::vector, $3)
      `,
      doc.pageContent,
      `[${vector.join(",")}]`,
      docId
    );
  }

  return "success";
}

export async function queryIndex(query: string, docId: string) {
  const queryEmbedding = await embeddings.embedQuery(query);

  const vectorString = `[${queryEmbedding.join(",")}]`;

  const results: { id: string; content: string; similarity: number }[] =
    await prisma.$queryRawUnsafe(
      `
      SELECT id, content, 1 - (embedding <=> $1::vector) AS similarity
      FROM "Chunk"
      WHERE "documentId" = $2
      ORDER BY similarity DESC
      LIMIT 3
    `,
      vectorString,
      docId
    );

  if (results.length === 0) {
    return "No matching chunks found in this document.";
  }

  const context = results.map((r) => r.content).join("\n\n");

  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    modelName: "gpt-4o-mini",
  });

  const response = await llm.invoke([
    { role: "system", content: `Answer only from context: ${context}` },
    { role: "user", content: query },
  ]);

  return response.content;
}
