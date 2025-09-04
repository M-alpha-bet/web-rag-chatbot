"use client";

import React from "react";
import { RxDotsHorizontal, RxDotsVertical } from "react-icons/rx";
import { motion, AnimatePresence } from "motion/react";
import { FaTwitter, FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function Navbar({ name }: { name: string | null }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <div className="flex items-center px-5 md:px-32 justify-between py-4 md:py-8 sticky top-0 z-20 backdrop-blur-3xl ">
        <div className="text-white">Greetings{name ? ` ${name}!` : "!"}</div>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/documents">Documents</Link>
        </div>

        <motion.div
          key={isOpen ? "close" : "open"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          className="md:hidden"
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <RxDotsVertical
              onClick={toggleMenu}
              className="size-7 text-white cursor-pointer"
            />
          ) : (
            <RxDotsHorizontal
              onClick={toggleMenu}
              className="size-7 text-white cursor-pointer"
            />
          )}
        </motion.div>
      </div>

      {/* Modal Component */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-[64px] right-0 w-full rounded-3xl h-auto bg-bgPurple text-white z-10 shadow-lg"
            >
              <div className="flex flex-col items-center justify-center py-7 space-y-4">
                <Link href="/" onClick={closeMenu} className="menu-item">
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="menu-item"
                >
                  Dashboard
                </Link>
                <Link
                  href="/documents"
                  onClick={closeMenu}
                  className="menu-item"
                >
                  Documents
                </Link>

                {/* Social icons, Add links later */}
                <div className="flex space-x-10 pt-8">
                  <Link href="https://x.com/martinfriday5?s=21">
                    <FaTwitter
                      onClick={closeMenu}
                      className="social-icons-purple3"
                    />
                  </Link>
                  <Link href="https://wa.link/vgs91p">
                    <FaWhatsapp
                      onClick={closeMenu}
                      className="social-icons-purple3"
                    />
                  </Link>
                  <Link href="https://www.linkedin.com/in/martin-friday-028417263?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app">
                    <FaLinkedin
                      onClick={closeMenu}
                      className="social-icons-purple3"
                    />
                  </Link>
                  <Link href="https://github.com/M-alpha-bet/web-rag-chatbot">
                    <FaGithub
                      onClick={closeMenu}
                      className="social-icons-purple3"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
