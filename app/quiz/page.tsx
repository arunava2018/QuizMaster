"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { BookOpen } from "lucide-react";
import QuizCards from "@/components/quiz/QuizCards";
interface Topic {
  _id: string;
  title: string;
  description: string;
  userAttempted: number;
}

export default function QuizTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/topics");
        const fetched = res.data.topics || [];

        // Sort by popularity
        const sorted = [...fetched].sort(
          (a, b) => b.userAttempted - a.userAttempted
        );

        setTopics(sorted);
        toast.success("Quiz topics loaded successfully");
      } catch (error) {
        console.error("Failed to load topics:", error);
        toast.error("Failed to load topics");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const totalParticipants = topics.reduce(
    (sum, topic) => sum + topic.userAttempted,
    0
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
          Choose Your Challenge
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join {totalParticipants.toLocaleString()}+ learners and test your
          knowledge with our curated quiz topics
        </p>

        {/* Stats Bar */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{topics.length}</div>
            <div className="text-sm text-muted-foreground">Topics</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {totalParticipants.toLocaleString()}+
            </div>
            <div className="text-sm text-muted-foreground">Participants</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">4.8</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Quiz Cards */}
      {topics.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground mb-2">
            No topics available
          </p>
          <p className="text-muted-foreground">
            Check back soon for new challenges!
          </p>
        </div>
      ) : (
        <QuizCards topics={topics} />
      )}
    </div>
  );
}
