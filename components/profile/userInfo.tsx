"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { User2, Mail, Trophy, Star, Activity, Calendar, Target } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface UserProps {
  userInfo: {
    success: boolean;
    totalTestsAttempted: number;
    topics: Array<{
      topicId: string;
      topicTitle: string;
      scores: number[];
      testAttempted: number;
    }>;
  } | null;
}

export default function UserInfo({ userInfo }: UserProps) {
  const { clerkUserId } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`/api/users/${clerkUserId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
    if (clerkUserId) {
      fetchUser();
    }
  }, [clerkUserId]);

  if (!userInfo) return null;

  // Calculate statistics for better insights
  const totalQuestions = userInfo.topics.reduce((acc, topic) => acc + (topic.scores.length * 20), 0);
  const totalCorrect = userInfo.topics.reduce((acc, topic) => 
    acc + topic.scores.reduce((sum, score) => sum + score, 0), 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const averageScore = userInfo.totalTestsAttempted > 0 
    ? Math.round(totalCorrect / userInfo.totalTestsAttempted) : 0;

  // Loading skeleton
  if (loading) {
    return (
      <Card className="w-full border shadow-sm bg-card animate-pulse">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full"></div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="h-6 bg-muted rounded w-32 mx-auto sm:mx-0"></div>
              <div className="h-4 bg-muted rounded w-48 mx-auto sm:mx-0"></div>
              <div className="h-6 bg-muted rounded w-24 mx-auto sm:mx-0"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 bg-muted rounded w-16"></div>
              <div className="h-6 bg-muted rounded w-20"></div>
              <div className="h-6 bg-muted rounded w-18"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Main Profile Card */}
      <Card className="w-full border shadow-sm bg-gradient-to-br from-card via-card to-accent/5">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar - centered on mobile, left-aligned on larger screens */}
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-background shadow-lg">
              <AvatarImage src={user?.avatar} className="object-cover" />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            {/* User Info - stacked on mobile, side-by-side on larger screens */}
            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight break-words">
                {user?.name || "User Name"}
              </CardTitle>

              <div className="flex items-center justify-center sm:justify-start text-muted-foreground gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">
                  {user?.email || "email@example.com"}
                </span>
              </div>

              {/* Stats Badge - responsive sizing */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm"
                >
                  <Trophy className="w-3 h-3" />
                  <span className="hidden xs:inline">Tests:</span>
                  {userInfo.totalTestsAttempted} Tests Attempted
                </Badge>
                
                {overallAccuracy > 0 && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  >
                    <Target className="w-3 h-3" />
                    {overallAccuracy}% Accuracy
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 sm:space-y-6">
          {/* Performance Metrics - responsive grid */}
          {userInfo.totalTestsAttempted > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-accent/5 rounded-lg border">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Average Score</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {averageScore}/20
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Questions Solved</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {totalCorrect}/{totalQuestions}
                </p>
              </div>
            </div>
          )}

          {/* Topics Section */}
          <div>
            <p className="text-sm font-medium flex items-center justify-center sm:justify-start gap-2 mb-3">
              <Activity className="h-4 w-4 text-primary" />
              Topics Practiced
              <span className="text-xs text-muted-foreground">
                ({userInfo.topics?.length || 0})
              </span>
            </p>

            {userInfo.topics?.length === 0 ? (
              <div className="text-center py-6 px-4 bg-accent/5 rounded-lg border-2 border-dashed">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  No topics attempted yet.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start practicing to see your progress!
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {userInfo.topics?.map((topic: any) => {
                  const latestScore = topic.scores[topic.scores.length - 1] || 0;
                  const improvement = topic.scores.length > 1 
                    ? latestScore - topic.scores[0] : 0;
                  
                  return (
                    <Badge
                      key={topic.topicId}
                      variant="outline"
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm flex items-center gap-1.5 hover:bg-accent/10 transition-colors"
                    >
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        {topic.topicTitle}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({topic.testAttempted})
                      </span>
                      {improvement > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          +{improvement}
                        </span>
                      )}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Card - only show if there's meaningful data */}
      {userInfo.totalTestsAttempted > 0 && (
        <Card className="w-full border shadow-sm bg-card/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Overall Progress</p>
              <div className="space-y-2">
                <Progress 
                  value={overallAccuracy} 
                  className="h-2 bg-accent/20"
                />
                <p className="text-xs text-muted-foreground">
                  {overallAccuracy}% accuracy across all tests
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
