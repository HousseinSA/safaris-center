// components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { Menu, X, Wallet, TrendingUp, UserPlus } from "lucide-react"; // Import icons
import { AnimatePresence, motion } from "framer-motion"; // Import Framer Motion

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow sticky top-0 left-0 z-50">
      <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/safariscenter.png"
              alt="safariscenter Logo"
              width={80}
              height={40}
              className="rounded-full"
            />
          </Link>

          {/* Hamburger Menu Icon (Visible on small screens) */}
          <div className="flex md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
              {isMenuOpen ? <X className="h-8 w-8 text-primary" /> : <Menu className="h-8 w-8 text-primary" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/recettes">
              <Button className="bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Recettes</span>
              </Button>
            </Link>
            <Link href="/depenses">
              <Button className="bg-red-600 text-white hover:bg-red-700 flex items-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span>Dépenses</span>
              </Button>
            </Link>
            <Link href="/nouveau-client">
              <Button className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Créer un client</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden mt-4"
            >
              <div className="flex flex-col space-y-4">
                <Link href="/recettes" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Recettes</span>
                  </Button>
                </Link>
                <Link href="/depenses" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-red-600 text-white hover:bg-red-700 flex items-center space-x-2">
                    <Wallet className="h-4 w-4" />
                    <span>Dépenses</span>
                  </Button>
                </Link>
                <Link href="/nouveau-client" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-primary text-white hover:bg-primary-dark flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Créer un client</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}