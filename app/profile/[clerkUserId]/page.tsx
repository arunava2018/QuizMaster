"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { Trophy, ClipboardList } from "lucide-react";
import UserInfo from "@/components/profile/userInfo";
import UserTopicStats from "@/components/profile/UserTopicStats";

interface UserProfile {
  success: boolean;
  totalTestsAttempted: number;
  topics: Array<{
    topicId: string;
    topicTitle: string;
    scores: number[];
    testAttempted: number;
  }>;
}

export default function ProfilePage() {
  const { clerkUserId } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`/api/profile/${clerkUserId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (clerkUserId) fetchUser();
  }, [clerkUserId]);

  // Loading skeleton for better UX
  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* UserInfo skeleton */}
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <div className="bg-card border rounded-lg p-6 animate-pulse">
            <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="h-3 bg-muted rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* UserTopicStats skeleton */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <div className="bg-card border rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-80 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  //If still loading
  if (loading) return <LoadingSkeleton />;

  //If user not found
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
              User Not Found
            </h2>
            <p className="text-muted-foreground">
              The requested profile could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasNoData =
    user.totalTestsAttempted === 0 || user.topics.length === 0;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      {/* Responsive layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* User Info Section */}
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <div className="sticky top-6">
            <UserInfo userInfo={user} />
          </div>
        </div>

        {/* User Topic Stats Section or Empty State */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          {hasNoData ? (
            <div className="bg-card border rounded-lg p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <ClipboardList className="w-14 h-14 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Test Data Yet
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                It looks like you haven’t attempted any quizzes yet. 
                Start your first test to see your progress and performance stats here!
              </p>
              <a
                href="/topics"
                className="inline-flex items-center px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Take Your First Quiz
              </a>
            </div>
          ) : (
            <UserTopicStats topics={user.topics} />
          )}
        </div>
      </div>
    </div>
  );
}
