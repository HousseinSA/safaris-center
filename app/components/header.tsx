// components/Header.tsx
"use client"; // Required for using React state and hooks

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Menu, X, Wallet, TrendingUp, UserPlus,
  LogOut,
  Settings
} from "lucide-react"; // Import icons
import { AnimatePresence, motion } from "framer-motion"; // Import Framer Motion
import { signOut, useSession } from "next-auth/react"; // Import NextAuth.js functions

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const { data: session } = useSession(); // Get the session

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // Redirect to login page after logout
  };

  return (
    <header className="bg-white shadow sticky top-0 left-0 z-50">
      <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex py-2 items-center">
                <Image
                  src="/safariscenter.png"
                  alt="safariscenter Logo"
                  width={80}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </Link>
          </div>

          {/* Hamburger Menu Icon (Visible on small screens) */}
          <div className="flex md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
              {isMenuOpen ? <X className="h-8 w-8 text-primary" /> : <Menu className="h-8 w-8 text-primary " />}
            </button>
          </div>

          {/* Desktop Menu (Hidden on small screens) */}
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

            {/* Settings Icon (Desktop) */}
            <Link href="/register-password">
              <Button className="bg-gray-600 text-white hover:bg-gray-700 flex items-center space-x-2">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>

            {/* Logout Button (Desktop) */}
            {session && (
              <Button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu (Slides in from the top) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} // Initial state (hidden and slightly above)
              animate={{ opacity: 1, y: 0 }} // Animate to visible and in place
              exit={{ opacity: 0, y: -20 }} // Animate out (hidden and slightly above)
              transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
              className="md:hidden mt-4"
            >
              <div className="flex flex-col space-y-4">
                <Link href="/recettes" onClick={closeMenu}>
                  <Button className="w-full bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Recettes</span>
                  </Button>
                </Link>

                <Link href="/depenses" onClick={closeMenu}>
                  <Button className="w-full bg-red-600 text-white hover:bg-red-700 flex items-center space-x-2">
                    <Wallet className="h-4 w-4" />
                    <span>Dépenses</span>
                  </Button>
                </Link>

                <Link href="/nouveau-client" onClick={closeMenu}>
                  <Button className="w-full bg-primary text-white hover:bg-primary-dark flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Créer un client</span>
                  </Button>
                </Link>

                <Link href="/register-password" onClick={closeMenu}>
                  <Button className="w-full bg-gray-600 text-white hover:bg-gray-700 flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>

                {session && (
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white hover:bg-red-700 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}