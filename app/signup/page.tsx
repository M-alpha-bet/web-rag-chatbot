import { auth } from "@/auth";
import SignUpContent from "@/components/SignUpContent";
import { redirect } from "next/navigation";

import React from "react";

export default async function SignUp() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <>
      <SignUpContent />
    </>
  );
}
