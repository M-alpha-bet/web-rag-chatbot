"use client";

import { createUser } from "@/lib/actions/createUser";
import React, { useState } from "react";
import { TbArrowForwardUpDouble } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUpContent() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await createUser(formData);
    if (result === "success") {
      toast.success("User created successfully!");
      router.push("/login");
    } else {
      toast.error(result);
    }
    setLoading(false);
  };

  return (
    <div className="w-full md:max-w-[380px] md:mx-auto h-screen flex flex-col justify-center items-center px-2">
      <div>
        <h2 className="header-text text-center mb-10">
          <span className="purple-text-gradient">Sign Up</span> here to continue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-[90%] mx-auto">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="input-field"
          />
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
            Already have an account?{" "}
            <Link className="purple-text-gradient underline!" href="/login">
              login here
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
              {loading ? "Creating user..." : "Continue"}
            </p>
          </button>
        </form>
      </div>
    </div>
  );
}
