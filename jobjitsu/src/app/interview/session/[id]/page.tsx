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
import { use } from "react";
import { apiService } from "@/services/api";
import { useSession } from "@supabase/auth-helpers-react";

type Message = {
  role: "recruiter" | "you";
  text: string;
  voiceUrl?: string | null;
  feedback?: any;
};

async function fetchNextQuestion(id: string, session: any) {
  return await apiService.getNextQuestion(id, session);
}

async function submitAnswer({ id, questionNumber, userAnswerText, session }: { id: string; questionNumber: number; userAnswerText: string; session: any }) {
  return await apiService.submitAnswer(id, questionNumber, userAnswerText, session);
}

async function fetchFollowup(id: string, session: any) {
  return await apiService.getFollowup(id, session);
}

async function fetchFeedback(id: string, session: any) {
  return await apiService.getFeedback(id, session);
}

async function completeSession(id: string) {
  const res = await fetch(`/session/${id}/complete`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to complete session");
  return res.json();
}

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const session = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState("");
  const [persona, setPersona] = useState<any>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const router = useRouter();

  const { data: nextQuestion, isLoading: loadingNext } = useQuery({
    queryKey: ["nextQuestion", id, questionCount],
    queryFn: () => fetchNextQuestion(id, session),
    enabled: messages.length % 2 === 0 && !!session,
  });

  const mutation = useMutation({
    mutationFn: submitAnswer,
    onSuccess: async () => {
      setAnswer("");
      setQuestionCount((prev) => prev + 1);
      toast.success("Answer submitted!");
      if (questionCount + 1 === 3) {
        const followup = await fetchFollowup(id, session);
        setMessages((m) => [...m, { role: "recruiter", text: followup, voiceUrl: null }]);
      }
      const feedback = await fetchFeedback(id, session);
      setMessages((m) => [...m, { role: "recruiter", text: `Feedback: ${feedback.feedback}`, feedback }]);
    },
  });

  useEffect(() => {
    if (nextQuestion) {
      setMessages((m) => [...m, { role: "recruiter", text: nextQuestion.question, voiceUrl: null }]);
    }
  }, [nextQuestion]);

  useEffect(() => {
    setPersona({ name: "Avery", bias_mode: "off" });
  }, []);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const lastQ = messages[messages.length - 1]?.text;
    setMessages((m) => [...m, { role: "you", text: answer }]);
    // Get the current question number from the query data
    const currentQuestionNumber = nextQuestion?.question_number || 1;
    mutation.mutate({ id: id, questionNumber: currentQuestionNumber, userAnswerText: answer, session: session });
  };

  const handleComplete = async () => {
    const summary = await completeSession(id);
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
            Submit Answer
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