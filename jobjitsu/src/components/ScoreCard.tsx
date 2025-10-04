// src/components/ScoreCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface ScoreCardProps {
  rubric: {
    clarity: number;
    structure_STAR: number;
    relevance: number;
    conciseness: number;
    technical_depth?: number;
  };
  score_overall: number;
}

export function ScoreCard({ rubric, score_overall }: ScoreCardProps) {
  return (
    <Card className="glow">
      <CardHeader>
        <CardTitle className="flex items-center">
          Overall Score: {score_overall}/5 <Star className="ml-2 text-yellow-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Object.entries(rubric).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="capitalize">{key.replace("_", " ")}</span>
            <Progress value={(value / 5) * 100} className="w-1/2" />
            <span>{value}/5</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}