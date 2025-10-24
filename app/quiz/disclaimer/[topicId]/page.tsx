"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import QuizDisclaimer from "@/components/quiz/QuizDisclaimer";

interface Topic {
  _id: string;
  title: string;
  description: string;
  userAttempted: number;
}


export default function QuizDisclaimerPage() {
  const { topicId } = useParams() as { topicId: string };
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await axios.get(`/api/topics/${topicId}`);
        setTopic(res.data.topic);
      } catch (error) {
        console.error("Failed to load topic:", error);
        toast.error("Failed to load quiz information.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Quiz topic not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <QuizDisclaimer
        topic={topic}
      />
    </div>
  );
}
