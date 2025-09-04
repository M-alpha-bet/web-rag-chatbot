import { auth } from "@/auth";
import LoginContent from "@/components/LoginContent";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <>
      <LoginContent />
    </>
  );
}
