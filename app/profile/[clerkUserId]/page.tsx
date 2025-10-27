"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
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

    if (clerkUserId) {
      fetchUser();
    }
  }, [clerkUserId]);

  // Loading skeleton component for better UX
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

  if (loading) {
    return <LoadingSkeleton />;
  }

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

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* User Info Section - Full width on mobile, 1/3 on large screens */}
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <div className="sticky top-6">
            <UserInfo userInfo={user} />
          </div>
        </div>

        {/* User Topic Stats Section - Full width on mobile, 2/3 on large screens */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <UserTopicStats topics={user?.topics || []} />
        </div>
      </div>

      {/* Additional content section for future expansion */}
      <div className="mt-8 lg:mt-12">
        {/* Space for additional profile sections like achievements, recent activity, etc. */}
      </div>
    </div>
  );
}
