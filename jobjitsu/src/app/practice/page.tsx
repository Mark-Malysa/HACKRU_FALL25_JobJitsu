// src/app/practice/page.tsx (Updated for red/black theme)
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModePicker } from "@/components/ModePicker";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export default function Practice() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Practice page - Session:", session);
      
      // If we already have a session, we're good
      if (session) {
        console.log("Session found, user is authenticated");
        setIsCheckingAuth(false);
        return;
      }
      
      // If no session, try to get it from Supabase directly
      console.log("No session from hook, checking Supabase directly...");
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      console.log("Practice page - Direct session check:", currentSession);
      console.log("Practice page - Error:", error);
      
      if (currentSession) {
        console.log("Session found via direct check, user is authenticated");
        setIsCheckingAuth(false);
      } else {
        console.log("No session found, redirecting to signin");
        router.push("/signin");
      }
    };

    checkAuth();
  }, [session, router, supabase]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Start Practice</h1>
      <p className="text-lg text-muted-foreground">Choose your mode to begin a new session.</p>
      <ModePicker />
    </div>
  );
}
