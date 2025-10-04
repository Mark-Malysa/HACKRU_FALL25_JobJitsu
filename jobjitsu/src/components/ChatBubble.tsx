// src/components/ChatBubble.tsx
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

interface ChatBubbleProps {
  role: "recruiter" | "you";
  text: string;
  voiceUrl?: string;
  feedback?: any; // For grading rubric if recruiter feedback
}

export function ChatBubble({ role, text, voiceUrl, feedback }: ChatBubbleProps) {
  return (
    <div className={`flex ${role === "you" ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          role === "you"
            ? "bg-secondary text-secondary-foreground"
            : "bg-card text-card-foreground glow"
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {voiceUrl && (
          <div className="mt-2 flex items-center">
            <audio controls src={voiceUrl} className="w-full" />
            <Badge variant="outline" className="ml-2">
              <Play className="w-4 h-4 mr-1" /> Voice
            </Badge>
          </div>
        )}
        {feedback && (
          <div className="mt-3 border-t pt-2">
            <h4 className="font-semibold text-primary">Feedback</h4>
            <p>{feedback.comments}</p>
            {/* Render ScoreCard inline if needed */}
          </div>
        )}
      </div>
    </div>
  );
}