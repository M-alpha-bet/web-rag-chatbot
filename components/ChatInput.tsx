"use client";

import { useState } from "react";
import { RiTelegram2Fill } from "react-icons/ri";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled: boolean;
}) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-center items-center gap-2">
        <input
          type="text"
          className="chat-input-box"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="px-5 !py-2 rounded-2xl button-container-gradient font-medium flex items-center disabled:opacity-50"
        >
          Send
          <RiTelegram2Fill className="inline ml-2 text-white1" />
        </button>
      </div>
    </div>
  );
}
