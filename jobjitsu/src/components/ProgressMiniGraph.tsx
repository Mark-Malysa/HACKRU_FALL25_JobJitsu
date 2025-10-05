// src/components/ProgressMiniGraph.tsx (Simple blue line to match clean style)
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface ProgressMiniGraphProps {
  data: { name: string; value: number }[];
}

export function ProgressMiniGraph({ data }: ProgressMiniGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="var(--primary)" 
          dot={false} 
          strokeWidth={2} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}