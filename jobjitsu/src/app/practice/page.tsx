// src/app/practice/page.tsx (Updated for red/black theme)
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModePicker } from "@/components/ModePicker";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export default function Practice() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const session = useSession();

  useEffect(() => {
    console.log("Practice page - Session:", session);
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, router]);

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Start Practice</h1>
      <p className="text-lg text-muted-foreground">Choose your mode to begin a new session.</p>
      <ModePicker />
    </div>
  );
}
