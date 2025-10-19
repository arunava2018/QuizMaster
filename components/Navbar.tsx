"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect } from "react"
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-foreground">
            QuizMaster
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button className="btn-outline">Sign In</button>
            <button className="btn-primary text-sm">Get Started</button>
          </div>

          {/* Mobile Menu Button */}
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
            <button className="p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="#features" className="block text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#faq" className="block text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
            <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <div className="flex gap-2 pt-2">
              <button className="btn-outline text-sm flex-1">Sign In</button>
              <button className="btn-primary text-sm flex-1">Get Started</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
