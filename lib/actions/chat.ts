"use server";

import { queryIndex } from "@/lib/actions/vectorStore";

export async function askDocumentQuestion(query: string, id: string) {
  if (!query) return "Empty query.";

  try {
    const result = await queryIndex(query, id);

    return (
      result || "Sorry, I couldn’t find anything relevant in this document."
    );
  } catch (error: any) {
    console.error("Error querying index:", error);
    return "Something went wrong while querying the document.";
  }
}
