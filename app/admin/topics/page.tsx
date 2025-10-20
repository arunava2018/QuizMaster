"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AddTopicDialog } from "@/components/admin/AddTopicDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Topic {
  _id: string;
  title: string;
  description: string;
}

export default function ManageTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    try {
      const res = await axios.get("/api/topics");
      setTopics(res.data.topics || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (topicId: string) => {
    try {
      const res = await axios.delete(`/api/topics/${topicId}`);
      toast.success(res.data.message);
      fetchTopics(); // Refresh list after deletion
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete topic");
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Topics</h1>
          <p className="text-muted-foreground">
            View, edit, or delete quiz topics.
          </p>
        </div>
        <AddTopicDialog onTopicAdded={fetchTopics} />
      </div>

      {/* Topics Section */}
      {loading ? (
        <p className="text-muted-foreground text-center mt-10">
          Loading topics...
        </p>
      ) : topics.length === 0 ? (
        <p className="text-muted-foreground text-center mt-10">
          No topics available.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {topics.map((topic) => (
            <Card
              key={topic._id}
              className="border border-border hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {topic.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(topic._id)}
                    variant="outline"
                    size="icon"
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {topic.description || "No description available."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
