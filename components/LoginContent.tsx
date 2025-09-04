"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { TbArrowForwardUpDouble } from "react-icons/tb";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error + "... Please check details and try again.");
      setLoading(false);
      router.refresh();
    } else if (result?.ok) {
      toast.success("Logged in successfully!");
      setLoading(false);
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="w-full md:max-w-[380px] md:mx-auto h-screen flex flex-col justify-center items-center px-2">
        <h1 className="header-text text-center my-12">
          <span className="purple-text-gradient">Welcome back!</span> Login Here
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 w-[90%] mx-auto">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input-field"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="input-field pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <p className="leading-[17px] mt-12">
            Don't have an account?{" "}
            <Link className="purple-text-gradient underline!" href="/signup">
              sign up here
            </Link>
          </p>

          <button
            type="submit"
            className="button-container-gradient text-center w-full flex items-center justify-center cursor-pointer"
          >
            <div className="py-2 px-3 rounded-full bg-purple2">
              <TbArrowForwardUpDouble className="inline text-white1" />
            </div>
            <p className="text-center w-[75%] mr-8 text-white font-medium">
              {loading ? "Logging in..." : "Login"}
            </p>
          </button>
        </form>
      </div>
    </>
  );
}
