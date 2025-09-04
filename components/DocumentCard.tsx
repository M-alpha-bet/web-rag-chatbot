"use client";
import { formatDate } from "@/lib/dateFormatter";
import Link from "next/link";
import React from "react";
import { IoDocumentText } from "react-icons/io5";

type DocumentCardProps = {
  id: string;
  title: string;
  createdAt: string;
};

export default function DocumentCard({
  id,
  title,
  createdAt,
}: DocumentCardProps) {
  return (
    <div
      key={id}
      className="py-4 mt-2 flex items-center border border-purple2 rounded-3xl"
    >
      <div className="bg-black1 rounded-r-2xl px-3 py-2">
        <IoDocumentText />
      </div>
      <Link href={`/chat/${id}`} className="mx-4 overflow-hidden">
        <p className="font-medium text-sm line-clamp-1">{title}</p>
        <p className="text-xs opacity-80">{formatDate(createdAt.toString())}</p>
      </Link>
    </div>
  );
}
