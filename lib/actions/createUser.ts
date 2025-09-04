"use server";
import bcrypt from "bcryptjs";
import prisma from "../prisma";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return "All fields are required, please check fields and try again.";
  }

  if (!email.includes("@")) {
    return "Please enter a valid email address.";
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return "User with this email already exists.";
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  return "success";
}
