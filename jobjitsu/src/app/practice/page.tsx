// src/app/practice/page.tsx (Updated to use ModePicker for starting session via /session/start)
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModePicker } from "@/components/ModePicker";

export default function Practice() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Implement authentication check here (e.g., using NextAuth or Supabase).
    // If user is not signed in, redirect to sign-in page or home.
    // For example:
    // const session = await getSession(); // From auth lib
    // if (!session) router.push('/auth/signin');
    // For now, just proceed (or redirect to google.com as placeholder).
    router.push("https://google.com");
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Start Practice</h1>
      <p className="text-lg text-secondary-foreground">Choose your mode to begin a new session.</p>
      <ModePicker />
    </div>
  );
}