import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer  from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuizMaster - Computer Science Quizzes",
  description: "Master DSA, OS, DBMS, and more with interactive quizzes built for developers.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar/>
          {children}
          <Footer/>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
