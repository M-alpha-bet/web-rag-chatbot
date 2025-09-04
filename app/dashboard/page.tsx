import { auth } from "@/auth";
import DocumentCard from "@/components/DocumentCard";
import Navbar from "@/components/Navbar";
import UploadButton from "@/components/UploadButton";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
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
    take: 3,
  });

  return (
    <>
      <Navbar name={user?.name as string | null} />
      <div className="my-7">
        <UploadButton />
      </div>
      <div className="border md:max-w-[480px] md:mx-auto border-purple2 rounded-3xl p-4 mx-6 my-5">
        <div className="flex items-center pb-4 justify-between">
          <p>History</p>
          <Link href="/documents" className="purple-text-gradient text-sm px-5">
            View All
          </Link>
        </div>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              createdAt={doc.createdAt.toString()}
            />
          ))
        )}
      </div>
    </>
  );
}
