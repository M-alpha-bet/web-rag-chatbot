"use client";

import { useState } from "react";
import { askDocumentQuestion } from "@/lib/actions/chat";
import ChatInput from "@/components/ChatInput";

export default function ChatPageContent({
  title,
  id,
}: {
  title: string;
  id: string;
}) {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (query: string) => {
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setLoading(true);

    try {
      const answer = await askDocumentQuestion(query, id);

      // Start typing effect
      let currentText = "";
      setMessages((prev) => [...prev, { role: "ai", text: "" }]);

      [...answer].forEach((char, i) => {
        setTimeout(() => {
          currentText += char;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "ai",
              text: currentText,
            };
            return newMessages;
          });
        }, i * 10); //speed of typing per character
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Error fetching answer." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-[580px] md:mx-auto min-h-dvh">
      <header className="m-4 border-b shadow-sm">
        <h1 className="text-[17px] md:[25px] font-semibold text-center purple-text-gradient">
          {title}
        </h1>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-bubble ${
              msg.role === "user"
                ? "ml-auto bg-purple2 text-white"
                : "mr-auto bg-gray-200 text-gray-900"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role !== "ai" && (
          <div className="message-bubble mr-auto bg-gray-200 text-gray-900">
            Thinking...
          </div>
        )}
      </main>

      <footer className="p-4 border-t">
        <ChatInput onSend={handleSend} disabled={loading} />
      </footer>
    </div>
  );
}
