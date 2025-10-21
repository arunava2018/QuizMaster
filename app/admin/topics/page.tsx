"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AddTopicDialog } from "@/components/admin/AddTopicDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  Trash2,
  Search,
  BookOpen,
  Plus,
  MoreVertical,
  AlertTriangle,
  Grid3X3,
  List,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Topic {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
}

export default function ManageTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  // New function: fetch counts for all topics
  const fetchAllQuestionCounts = async (topicList: Topic[]) => {
    try {
      const counts: Record<string, number> = {};

      // Fetch all counts in parallel
      await Promise.all(
        topicList.map(async (topic) => {
          try {
            const res = await axios.get(`/api/topics/${topic._id}/question-count`);
            counts[topic._id] = res.data.questionCount || 0;
          } catch (err) {
            console.error(`Failed to fetch count for ${topic.title}`, err);
            counts[topic._id] = 0;
          }
        })
      );

      setQuestionCounts(counts);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (topicId: string) => {
    try {
      const res = await axios.delete(`/api/topics/${topicId}`);
      toast.success(res.data.message);
      fetchTopics();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete topic");
    }
  };

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadData = async () => {
      await fetchTopics();
    };
    loadData();
  }, []);

  // Once topics are loaded, fetch their question counts
  useEffect(() => {
    if (topics.length > 0) {
      fetchAllQuestionCounts(topics);
    }
  }, [topics]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              Manage Topics
            </h1>
            <p className="text-muted-foreground mt-2">
              Create, organize, and manage quiz topics for your platform.
            </p>
          </div>
          <AddTopicDialog onTopicAdded={fetchTopics} />
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredTopics.length} topic
              {filteredTopics.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading topics...</p>
          </div>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <>
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No topics found
              </h3>
              <p className="text-muted-foreground mb-4">
                No topics match your search for "{searchTerm}"
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            </>
          ) : (
            <>
              <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No topics yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first quiz topic.
              </p>
              <AddTopicDialog onTopicAdded={fetchTopics} />
            </>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {filteredTopics.map((topic) => (
            <Card
              key={topic._id}
              className={`group border border-border hover:shadow-lg transition-all duration-200 hover:border-primary/20 ${
                viewMode === "list" ? "flex-row" : ""
              }`}
            >
              {viewMode === "grid" ? (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {topic.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {questionCounts[topic._id] ?? 0} questions
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Topic
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Topic
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                  Delete Topic
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{topic.title}
                                  "? This action cannot be undone and will also
                                  delete all associated questions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(topic._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {topic.description || "No description available."}
                    </p>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-between p-6 w-full">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {topic.description || "No description available."}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-2">
                        {questionCounts[topic._id] ?? 0} questions
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Delete Topic
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{topic.title}"?
                            This action cannot be undone and will also delete
                            all associated questions.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(topic._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
