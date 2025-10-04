// src/app/interview/session/[id]/page.tsx (Updated for red/black theme)
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatBubble } from "@/components/ChatBubble";
import { ScoreCard } from "@/components/ScoreCard";
import { PersonaChip } from "@/components/PersonaChip";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";

type Message = {
  role: "recruiter" | "you";
  text: string;
  voiceUrl?: string | null;
  feedback?: any;
};

async function fetchNextQuestion(id: string) {
  const res = await fetch(`/session/${id}/next`);
  if (!res.ok) throw new Error("Failed to fetch next question");
  return res.json();
}

async function submitAnswer({ id, questionText, userAnswerText }: { id: string; questionText: string; userAnswerText: string }) {
  const res = await fetch(`/session/${id}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionText, userAnswerText }),
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}

async function fetchFollowup(id: string) {
  const res = await fetch(`/session/${id}/followup`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to fetch followup");
  return res.json();
}

async function fetchFeedback(id: string) {
  const res = await fetch(`/session/${id}/feedback`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to fetch feedback");
  return res.json();
}

async function completeSession(id: string) {
  const res = await fetch(`/session/${id}/complete`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to complete session");
  return res.json();
}

export default function SessionPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState("");
  const [persona, setPersona] = useState<any>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const router = useRouter();

  const { data: nextQuestion, isLoading: loadingNext } = useQuery({
    queryKey: ["nextQuestion", params.id, questionCount],
    queryFn: () => fetchNextQuestion(params.id),
    enabled: messages.length % 2 === 0,
  });

  const mutation = useMutation({
    mutationFn: submitAnswer,
    onSuccess: async () => {
      setAnswer("");
      setQuestionCount((prev) => prev + 1);
      toast.success("Answer submitted!");
      if (questionCount + 1 === 3) {
        const followup = await fetchFollowup(params.id);
        setMessages((m) => [...m, { role: "recruiter", text: followup.questionText, voiceUrl: followup.voiceUrl }]);
      }
      const feedback = await fetchFeedback(params.id);
      setMessages((m) => [...m, { role: "recruiter", text: `Feedback: ${feedback.comments}`, feedback }]);
    },
  });

  useEffect(() => {
    if (nextQuestion) {
      setMessages((m) => [...m, { role: "recruiter", text: nextQuestion.questionText, voiceUrl: nextQuestion.voiceUrl }]);
    }
  }, [nextQuestion]);

  useEffect(() => {
    setPersona({ name: "Avery", bias_mode: "off" });
  }, []);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const lastQ = messages[messages.length - 1]?.text;
    setMessages((m) => [...m, { role: "you", text: answer }]);
    mutation.mutate({ id: params.id, questionText: lastQ, userAnswerText: answer });
  };

  const handleComplete = async () => {
    const summary = await completeSession(params.id);
    toast.info("Session completed!");
    router.push("/profile");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "Enter") handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answer]);

  if (loadingNext) return <Skeleton className="h-screen w-full" />;

  return (
    <div className="container mx-auto p-6 space-y-4 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-primary">Interview Session</h1>
        <PersonaChip company="Google" role="SWE Intern" biasMode={persona?.bias_mode} />
        <Button onClick={handleComplete} variant="destructive" className="bg-destructive text-destructive-foreground">
          End Session
        </Button>
      </div>
      <div className="border rounded-xl p-4 max-h-[60vh] overflow-y-auto space-y-3 bg-card shadow-soft">
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} voiceUrl={m.voiceUrl ?? undefined} feedback={m.feedback} />
        ))}
        {mutation.isPending && <Skeleton className="h-12 w-3/4" />}
      </div>
      <div className="space-y-2">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer… Use STAR method for best results."
          className="min-h-[100px] bg-input border-border text-foreground"
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={handleSubmit} disabled={mutation.isPending} className="button-primary">
            Submit Answer (⌘ + Enter)
          </Button>
        </div>
      </div>
      {messages.some((m) => m.feedback) && (
        <div className="mt-6">
          <ScoreCard rubric={messages[messages.length - 1]?.feedback?.rubric || {}} score_overall={messages[messages.length - 1]?.feedback?.score_overall || 0} />
        </div>
      )}
    </div>
  );
}