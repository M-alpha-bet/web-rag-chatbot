"use server";

import { queryIndex } from "@/lib/actions/vectorStore";

export async function askDocumentQuestion(query: string) {
  if (!query) return "Empty query.";

  try {
    const results = await queryIndex(query);

    return results.length > 0
      ? results.join("\n\n---\n\n")
      : "Sorry, I couldn’t find anything relevant in this document.";
  } catch (error: any) {
    console.error("Error querying index:", error);
    return "Something went wrong while querying the document.";
  }
}
