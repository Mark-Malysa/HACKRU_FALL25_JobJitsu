// src/app/page.tsx (Updated colors for red/black theme)
"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Customize the hero image pixel dimensions here
const HERO_WIDTH = 520; // px
const HERO_HEIGHT = 320; // px (adjust to control visible height)

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16 max-w-6xl bg-gradient-to-r from-red-100 to-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-12">
        <div className="md:w-1/2 text-left space-y-6">
          <h1 className="text-6xl font-extrabold text-foreground leading-tight drop-shadow-md">AI Interviewer for Job Interviews</h1>
          <p className="text-xl text-muted-foreground">Simulate real interviews and get actionable, intelligent feedback for job applications.</p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-6">
            <Button className="button-primary rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">Try for free now! →</Button>
            <Button className="button-primary rounded-full px-8 py-3 bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">Explore pricing</Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-6 shadow-soft w-full max-w-[640px] flex justify-center border-4 border-red-500">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://thumbs.dreamstime.com/b/job-applicant-having-interview-handshake-interviewing-120030117.jpg"
                alt="AI Interview Simulation"
                width={HERO_WIDTH}
                height={HERO_HEIGHT}
                priority={true}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-12">
        <h2 className="text-4xl font-bold text-center text-foreground drop-shadow-md">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Choose Your Mode",
              description: "Select from various interview modes tailored to your needs.",
              icon: <svg className="w-6 h-6 md:w-8 md:h-8 text-primary hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m-6 0V5a2 2 0 012-2h2a2 2 0 012 2v14" /></svg>,
            },
            {
              title: "Engage in Realistic Interviews",
              description: "Practice with AI-driven interviews that mimic real-world scenarios.",
              icon: <svg className="w-6 h-6 md:w-8 md:h-8 text-primary hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4M9 16h6m-6 4h6m2-10v6m-2-6h-2m-4 0H7" /></svg>,
            },
            {
              title: "Receive Actionable Feedback",
              description: "Get detailed feedback to improve your interview skills.",
              icon: <svg className="w-6 h-6 md:w-8 md:h-8 text-primary hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-6">
              <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground drop-shadow-md">{step.title}</h3>
              <p className="text-md text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-foreground drop-shadow-md">
          Trusted by top companies with challenging interviews
        </h2>
        <p className="text-lg text-muted-foreground">
          Prepare for interviews at FAANG and other leading companies.
        </p>
        <div className="scroll-container">
          {/* Corrected placeholder logos */}
          <img
            src="/meta.png"
            alt="Meta"
          />
          <img
            src="/amazon.png"
            alt="Amazon Logo"
          />
          <img
            src="/apple.png"
            alt="Apple Logo"
          />
          <img
            src="/google.png"
            alt="Google Logo"
          />
          <img
            src="/microsoft.png"
            alt="Microsoft Logo"
          />
          <img
            src="/tesla.png"
            alt="Tesla Logo"
          />
          <img
            src="/cisco.jpg"
            alt="Cisco Logo"
          />
          <img
            src="/doordash.png"
            alt="DoorDash Logo"
          />
          <img
            src="/IBM.png"
            alt="IBM Logo"
          />
          <img
            src="/nvidia.png"
            alt="NVIDIA Logo"
          />
          <img
            src="/xai.png"
            alt="XAI Logo"
          />
          <img
            src="/samsung.png"
            alt="Samsung Logo"
          />
          <img
            src="/logo.png"
            alt="Our Logo"
          />
        </div>
      </section>

      {/* Additional Info */}
      <section className="text-center space-y-6 bg-red-100 p-8 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-foreground drop-shadow-md">Ready to Level Up?</h2>
        <p className="text-lg text-muted-foreground">Sign up today and start practicing for your dream job.</p>
        <Button className="button-primary rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">Sign Up / Sign In</Button>
      </section>
    </div>
  );
}
