// src/app/profile/page.tsx (Updated for red/black theme)
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

// Mock fetch (unchanged)
async function fetchProfileStats() {
  return {
    averageScore: 85,
    trends: [{ name: "Week 1", score: 80 }, { name: "Week 2", score: 85 }, { name: "Week 3", score: 90 }],
    skillsRadar: [
      { skill: "Clarity", value: 4.5 },
      { skill: "STAR", value: 4.8 },
      { skill: "Relevance", value: 4.2 },
      { skill: "Conciseness", value: 3.5 },
      { skill: "Technical", value: 4.0 },
    ],
    strengths: ["Storytelling", "Relevance"],
    weaknesses: ["Conciseness", "Metrics"],
    badges: ["Interview Pro", "Bias Buster"],
  };
}

export default function Profile() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfileStats,
  });

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Your Profile</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-4xl text-foreground">{data?.averageScore}%</p>}
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data?.trends}>
                  <Line type="monotone" dataKey="score" stroke="var(--primary)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="shadow-soft bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Skills Radar</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data?.skillsRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" stroke="var(--foreground)" fill="var(--foreground)" />
                  <Radar name="Skills" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Strengths</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {isLoading
              ? Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-6 w-24" />)
              : data?.strengths.map((s) => <Badge key={s} variant="secondary" className="bg-secondary text-secondary-foreground">{s}</Badge>)}
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Weaknesses</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {isLoading
              ? Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-6 w-24" />)
              : data?.weaknesses.map((w) => <Badge key={w} variant="destructive" className="bg-destructive text-destructive-foreground">{w}</Badge>)}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="shadow-soft bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Badges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {isLoading
              ? Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-6 w-24" />)
              : data?.badges.map((b) => <Badge key={b} variant="outline" className="border-border text-foreground">{b}</Badge>)}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}