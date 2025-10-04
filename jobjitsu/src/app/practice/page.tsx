// src/app/practice/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModePicker } from "@/components/ModePicker";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";  // Added imports

export default function Practice() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const session = useSession();

  useEffect(() => {
    console.log("Practice page - Session:", session);
    if (!session) {
      console.log("No session found, redirecting to auth/signin");
      router.push("/auth/signin");  // Redirect if not authenticated
    } else {
      console.log("Session found, user is authenticated");
    }
  }, [session, router]);

  if (!session) return null;  // Or loading spinner

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Start Practice</h1>
      <p className="text-lg text-secondary-foreground">Choose your mode to begin a new session.</p>
      <ModePicker />
    </div>
  );
}