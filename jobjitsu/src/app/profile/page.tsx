// src/app/profile/page.tsx (Updated to use /user/{id}/sessions for data)
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

// Assume user ID from auth (mock 'user123' for now)
const USER_ID = "user123";

async function fetchProfileStats() {
  const res = await fetch(`/user/${USER_ID}/sessions`);  // Updated endpoint
  if (!res.ok) throw new Error("Failed to fetch sessions");
  const sessions = await res.json();  // Assume array of sessions

  // Aggregate data client-side (or backend if possible)
  const averageScore = sessions.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / sessions.length || 0;
  const trends = sessions.map((s: any, i: number) => ({ name: `Session ${i+1}`, score: s.score }));
  const skillsRadar = [  // Mock aggregation; compute from sessions
    { skill: "Clarity", value: 4.5 },
    { skill: "STAR", value: 4.8 },
    { skill: "Relevance", value: 4.2 },
    { skill: "Conciseness", value: 3.5 },
    { skill: "Technical", value: 4.0 },
  ];
  const strengths = ["Storytelling", "Relevance"];
  const weaknesses = ["Conciseness", "Metrics"];
  const badges = sessions.flatMap((s: any) => s.badges || []);

  return { averageScore, trends, skillsRadar, strengths, weaknesses, badges };
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
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-4xl">{data?.averageScore}%</p>}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Score Trends</CardTitle>
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
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Skills Radar</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data?.skillsRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <Radar name="Skills" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {isLoading
              ? Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-6 w-24" />)
              : data?.strengths.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Weaknesses</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {isLoading
              ? Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-6 w-24" />)
              : data?.weaknesses.map((w) => <Badge key={w} variant="destructive">{w}</Badge>)}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {isLoading
              ? Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-6 w-24" />)
              : data?.badges.map((b: string) => <Badge key={b} variant="outline">{b}</Badge>)}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}