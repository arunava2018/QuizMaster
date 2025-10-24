"use client";

import { ReactNode } from "react";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-start bg-gradient-to-b from-background via-muted/20 to-muted/40">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
