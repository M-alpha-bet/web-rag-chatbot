import prisma from "@/lib/prisma";
import ChatPageContent from "@/components/ChatPageContent";

export default async function ChatPage({
  params,
}: {
  params: { docId: string };
}) {
  const id = (await params).docId;

  const doc = await prisma.document.findFirst({
    where: { id },
  });

  if (!doc) {
    return (
      <div className="p-8 text-center text-red-500">Document not found.</div>
    );
  }

  return (
    <>
      <div className="overflow-hidden w-full">
        <ChatPageContent title={doc.title} id={doc.id} />
      </div>
    </>
  );
}
