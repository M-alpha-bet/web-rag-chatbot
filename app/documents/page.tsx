import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import { formatDate } from "@/lib/dateFormatter";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { IoDocumentText } from "react-icons/io5";

export default async function documentsPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const documents = await prisma.document.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <Navbar name={user?.name as string | null} />
      <h1 className="header-text text-center py-7 purple-text-gradient">
        Uploaded documents
      </h1>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="py-4 md:max-w-[580px] md:mx-auto mx-5 mt-4 items-center border border-purple2 rounded-3xl"
        >
          <div className="flex justify-center">
            <IoDocumentText className="size-8" />
          </div>
          <Link href={`/chat/${doc.id}`} className="mx-4 overflow-hidden">
            <p className="font-medium text-sm line-clamp-1 text-center">
              {doc.title}
            </p>
            <p className="text-xs opacity-80 text-center">
              {formatDate(doc.createdAt.toString())}
            </p>
          </Link>
        </div>
      ))}
      <div className="pb-7" />
    </>
  );
}
