"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddQuestionDialog } from "@/components/admin/AddQuestionDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Pencil, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  BookOpen,
  HelpCircle
} from "lucide-react";

interface Topic {
  _id: string;
  title: string;
}

interface Question {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  explanation: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'hard':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

export default function ManageTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

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

  const fetchQuestions = async (topicId: string) => {
    try {
      const res = await axios.get(`/api/questions?topicId=${topicId}`);
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
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

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Manage Quiz Questions
          </h1>
          <p className="text-muted-foreground mt-2">
            Add, view, edit, or delete quiz questions organized by topics.
          </p>
        </div>
        <AddQuestionDialog />
      </div>

      {/* Filter By Topic */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-foreground">
            Filter by Topic:
          </label>
          <Select
            onValueChange={(value) => {
              setSelectedTopic(value);
              fetchQuestions(value);
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a topic to view questions" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic._id} value={topic._id}>
                  {topic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions List */}
      {selectedTopic && questions.length > 0 && (
        <div className="mb-8 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total Questions: <strong className="text-foreground">{questions.length}</strong></span>
            <div className="flex gap-4">
              <span>Easy: <strong className="text-green-600">{questions.filter(q => q.difficulty.toLowerCase() === 'easy').length}</strong></span>
              <span>Medium: <strong className="text-yellow-600">{questions.filter(q => q.difficulty.toLowerCase() === 'medium').length}</strong></span>
              <span>Hard: <strong className="text-red-600">{questions.filter(q => q.difficulty.toLowerCase() === 'hard').length}</strong></span>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        {selectedTopic && questions.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No questions available for the selected topic.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Start by adding some questions using the button above.
            </p>
          </div>
        ) : (
          questions.map((question, index) => (
            
            <Card key={question._id} className="relative overflow-hidden border-l-4 border-l-primary/20 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        Q{index + 1}
                      </span>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-relaxed">
                      {question.questionText}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Options */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Answer Options
                  </h4>
                  <div className="grid gap-2">
                    {question.options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border text-sm flex items-center gap-3 ${
                          option === question.correctAnswer
                            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/10 dark:border-green-800 dark:text-green-300'
                            : 'bg-muted/30 border-border hover:bg-muted/50 transition-colors'
                        }`}
                      >
                        <span className="text-xs font-mono bg-background border px-2 py-1 rounded">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {option === question.correctAnswer && (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Explanation
                      </h4>
                      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Question Stats */}
      
    </section>
  );
}
