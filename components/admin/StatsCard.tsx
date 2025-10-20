"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StatsCardProps {
  title: string;
  value?: number;
  icon?: React.ReactNode;
  loading?: boolean;
  onView?: () => void;
}

export function StatsCard({ title, value, icon, loading, onView }: StatsCardProps) {
  return (
    <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-foreground">{value ?? "--"}</p>
            {onView && (
              <Button variant="outline" size="sm" onClick={onView}>
                View
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
