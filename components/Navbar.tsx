"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun, Home, Shield, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) return;
      try {
        const { data } = await axios.get("/api/admin/check");
        setIsAdmin(data.isAdmin);
      } catch (err) {
        console.error("Failed to check admin:", err);
      }
    };
    checkAdmin();
  }, [user]);
  const handleClick = () => {
    if (user?.id) {
      router.push(`/profile/${user.id}`);
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-foreground">
            QuizMaster
          </Link>

          {/* Desktop Section */}
          <div className="hidden md:flex items-center gap-5">
            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            {/* Admin Button */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}

            {isSignedIn && (
              <Button
                variant="ghost"
                onClick={handleClick} 
                className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Button>
            )}

            {/* Auth Buttons */}
            <SignedOut>
              <SignInButton mode="redirect">
                <button className="btn-outline cursor-pointer text-sm px-5 py-2 rounded-full">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="cursor-pointer btn-primary text-sm px-5 py-2 rounded-full">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>

          {/* Mobile Section */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 cursor-pointer rounded-lg border border-border hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 py-4 border-t border-border animate-fadeIn">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}

            {isSignedIn && (
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-sm transition-colors text-muted-foreground hover:text-foreground"
                onClick={handleClick}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Button>
            )}

            <SignedOut>
              <div className="flex flex-col gap-3 w-full px-6">
                <SignInButton mode="redirect">
                  <button className="btn-outline text-sm w-full py-2 rounded-full">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <button className="btn-primary text-sm w-full py-2 rounded-full">
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="pt-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        )}
      </div>
    </nav>
  );
}
