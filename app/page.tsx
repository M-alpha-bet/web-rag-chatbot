"use client";
import Image from "next/image";
import { TiUserAdd } from "react-icons/ti";
import { TbArrowForwardUpDouble } from "react-icons/tb";
import { motion } from "motion/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar name="" />
      <div className="mt-16 overflow-hidden">
        <div className="text-center px-4">
          <motion.h1
            className="font-semibold header-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            AI Knowledge <br />
            <span className="purple-text-gradient">Assistant</span>
          </motion.h1>
          <motion.p
            className="pb-10 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Upload your document, ask questions and get answers
          </motion.p>
          <div className="relative flex translate-x-[50px] md:translate-x-0 md:justify-center items-start mt-3 md:my-7">
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 150 }}
            >
              <motion.div
                initial={{ y: 0, rotate: 0 }}
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -3, 3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <Image
                  src="/images/robo-assistant.png"
                  alt="Robot assistant"
                  width={100}
                  height={100}
                />
              </motion.div>

              <div className="absolute -top-6 left-full ml-4 bg-black1 text-white rounded-2xl px-4 py-2 shadow-md w-max max-w-[200px]">
                Hey, I'm here <br /> to help...
              </div>

              <div className="absolute top-2 left-full ml-1 flex flex-col items-start space-y-1">
                <span className="w-3 h-3 bg-black1 rounded-full"></span>
                <span className="w-2 h-2 bg-black1 rounded-full"></span>
                <span className="w-1 h-1 bg-black1 rounded-full"></span>
              </div>
            </motion.div>
          </div>
          <Link href="/login">
            <motion.div
              className="mt-20 max-w-[480px] button-container-gradient pr-4 pl-1 shadow-md w-[90%] mx-auto flex justify-between items-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 0.95, 1] }}
              transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }}
            >
              <div className="py-2 px-3 rounded-full bg-purple2">
                <TiUserAdd className="inline text-white1" />
              </div>
              Login to continue
              <TbArrowForwardUpDouble className="inline size-5" />
            </motion.div>{" "}
          </Link>
        </div>
      </div>
    </>
  );
}
