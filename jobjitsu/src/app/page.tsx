// src/app/page.tsx (Updated with real avatar URLs)
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16 max-w-6xl">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
        <div className="md:w-1/2 text-left space-y-4">
          <Badge variant="secondary" className="rounded-full px-4 py-1">
            ★ Join 6,700+ interviewees this cycle
          </Badge>
          <h1 className="text-5xl font-bold text-foreground leading-tight">AI Interviewer for Job Interviews</h1>
          <p className="text-lg text-muted-foreground">
            Simulate real interviews and get actionable, intelligent feedback for job applications.
          </p>
          <div className="flex space-x-4">
            <Button className="button-primary rounded-full px-6">Try for free now! →</Button>
            <Button variant="outline" className="rounded-full px-6">Explore pricing</Button>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-4 shadow-soft">
          { /* Home page image - REPLACE */ }
            <Image
              src="https://interviewer.ai/wp-content/uploads/2022/05/Landing-Page-Hero-Image.png"
              alt="AI Interview Simulation"
              width={962}
              height={633}
              className="rounded-2xl"
            />
            {/* Overlay elements */}
            <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow">
              <Image
                src="https://static.vecteezy.com/system/resources/previews/020/168/718/non_2x/smiling-female-student-flat-avatar-icon-with-green-dot-editable-default-persona-for-ux-ui-design-profile-character-picture-with-online-status-indicator-colorful-messaging-app-user-badge-vector.jpg"
                alt="Candidate 1"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow">
              <span className="text-red-500">● Rec</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft rounded-lg">
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-center text-xl">Discover Questions</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-secondary-foreground">
              Explore role-specific questions and scenarios.
            </CardContent>
          </Card>
          <Card className="shadow-soft rounded-lg">
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-center text-xl">Enter AI Interview</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-secondary-foreground">
              Simulate real interviews with voice and feedback.
            </CardContent>
          </Card>
          <Card className="shadow-soft rounded-lg">
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-center text-xl">Review Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-secondary-foreground">
              Get detailed scores and improvement tips.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Info */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-semibold">Ready to Level Up?</h2>
        <p className="text-lg text-secondary-foreground">Sign up today and start practicing for your dream job.</p>
        <Button className="button-primary rounded-full px-6">Sign Up / Sign In</Button>
      </section>
    </div>
  );
}