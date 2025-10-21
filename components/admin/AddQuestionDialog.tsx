"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Topic {
  _id: string;
  title: string;
}

export function AddQuestionDialog({
  onQuestionAdded,
}: {
  onQuestionAdded?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get("/api/topics");
        setTopics(res.data.topics || []);
      } catch (err) {
        toast.error("Failed to load topics");
      }
    };
    if (open) fetchTopics();
  }, [open]);

  const handleAddOption = () => setOptions([...options, ""]);
  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    if (!selectedTopic) {
      toast.error("Please select a topic.");
      return;
    }

    if (!questionText.trim() || options.some((opt) => !opt.trim())) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("/api/questions", {
        topicId: selectedTopic,
        questionText,
        options,
        correctAnswer,
        difficulty,
        explanation,
      });

      toast.success(res.data.message || "Question added successfully!");
      setOpen(false);
      resetForm();
      onQuestionAdded?.();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add question");
    }
  };

  const resetForm = () => {
    setSelectedTopic(null);
    setQuestionText("");
    setOptions(["", ""]);
    setCorrectAnswer("");
    setDifficulty("easy");
    setExplanation("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button> <PlusCircle/> Add Question</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Select Topic */}
          <div>
            <label className="block text-sm mb-1 font-medium">Select Topic</label>
            <Select onValueChange={(value) => setSelectedTopic(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose topic" />
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

          {/* Question */}
          <div>
            <label className="block text-sm mb-1 font-medium">Question</label>
            <Input
              placeholder="Enter question text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm mb-1 font-medium">Options</label>
            {options.map((option, i) => (
              <Input
                key={i}
                placeholder={`Option ${i + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                className="mb-2"
              />
            ))}
            <Button variant="outline" onClick={handleAddOption}>
              + Add Option
            </Button>
          </div>

          {/* Correct Answer */}
          <div>
            <label className="block text-sm mb-1 font-medium">Correct Answer</label>
            <Input
              placeholder="Enter correct answer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm mb-1 font-medium">Difficulty</label>
            <Select onValueChange={setDifficulty} value={difficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm mb-1 font-medium">Explanation (optional)</label>
            <Input
              placeholder="Enter explanation (optional)"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
