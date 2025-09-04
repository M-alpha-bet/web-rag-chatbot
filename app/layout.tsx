import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Web RAG Chatbot",
  description:
    "A chatbot that uses Retrieval-Augmented Generation (RAG) to answer questions based on provided documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
