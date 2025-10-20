"use client";

import { useRouter } from "next/navigation";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, FileQuestion } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  const managementCards = [
    {
      title: "Manage Topics",
      description: "View, add, or edit quiz topics",
      icon: <FolderKanban className="text-blue-500 w-6 h-6" />,
      href: "/admin/topics",
    },
    {
      title: "Manage Questions",
      description: "View and manage quiz questions per topic",
      icon: <FileQuestion className="text-green-500 w-6 h-6" />,
      href: "/admin/questions",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of platform stats and quiz management tools.
          </p>
        </div>

        <Separator />

        

        {/* Management Cards */}
        <h2 className="text-xl font-semibold mt-3 text-foreground">
          Manage Content
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {managementCards.map((card) => (
            <Card
            key={card.title}
            onClick={() => router.push(card.href)}
            className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Separator />
        {/* Stats Section */}
        <h2 className="text-xl font-semibold mt-3 text-foreground">
          Overall Stats
        </h2>
        <DashboardStats />
      </div>
    </section>
  );
}
