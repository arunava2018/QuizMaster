"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Users,
  Clock,
  Star,
  TrendingUp,
  ChevronRight,
  Award,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Topic {
  _id: string;
  title: string;
  description: string;
  userAttempted: number;
}

export default function QuizCards({ topics }: { topics: Topic[] }) {
  const router = useRouter();
  const maxAttempts =
    topics.length > 0 ? Math.max(...topics.map((t) => t.userAttempted)) : 0;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
      {topics.map((topic, index) => {
        const isHot =
          topic.userAttempted === maxAttempts && topic.userAttempted > 0;
        const popularityScore = Math.min(
          (topic.userAttempted / maxAttempts) * 100,
          100
        );

        return (
          <Card
            key={topic._id}
            className={`group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              isHot ? "ring-2 ring-primary/20 border-primary/50" : ""
            } ${index < 3 ? "md:hover:scale-[1.02]" : ""}`}
          >
            {/* Gradient Overlay */}
            {index < 3 && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}

            <CardHeader className="relative pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {topic.title}
                    </CardTitle>
                    {isHot && (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1 animate-pulse bg-orange-500 hover:bg-orange-600"
                      >
                        <Flame className="w-3 h-3" />
                        Hot
                      </Badge>
                    )}
                  </div>
                </div>

                {index < 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    Top {index + 1}
                  </Badge>
                )}
              </div>

              <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {topic.description}
              </CardDescription>

              {/* Popularity Progress */}
              {popularityScore > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Popularity</span>
                    <span>{Math.round(popularityScore)}%</span>
                  </div>
                  <Progress value={popularityScore} className="h-1.5" />
                </div>
              )}
            </CardHeader>

            <CardContent className="pt-0">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  <span>{topic.userAttempted.toLocaleString()} attempted</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  <span>20 min</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 mr-2 text-primary" />
                  <span>20 questions</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
                  <span>4.8/5</span>
                </div>
              </div>

              <Button
                onClick={() => router.push(`/quiz/disclaimer/${topic._id}`)}
                className="w-full group/btn relative overflow-hidden"
                size="lg"
              >
                <span className="flex items-center justify-center">
                  Start Challenge
                  <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </CardContent>

            {/* Trending Indicator */}
            {isHot && (
              <div className="absolute top-2 right-2">
                <div className="flex items-center space-x-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>Trending</span>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
