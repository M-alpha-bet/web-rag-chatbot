"use client";

import { uploadDocument } from "@/lib/actions/handleDoc";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { TbUpload } from "react-icons/tb";
import { toast } from "sonner";

export default function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      toast("Uploading document...");
      const result = await uploadDocument(file);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Document uploaded successfully!");
        router.push(`/chat/${result.docId}`);
      }
    }
  };

  return (
    <div className="flex justify-center px-4">
      <button
        onClick={handleClick}
        className="relative w-72 h-40 rounded-3xl bg-gradient-to-r from-purple3 to-purple2 text-white shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col items-center justify-center"
      >
        <TbUpload className="text-4xl mb-2" />
        <span className="font-semibold text-lg">Upload Document</span>
        <span className="text-xs opacity-80">PDF, DOCX, TXT…</span>
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
    </div>
  );
}
