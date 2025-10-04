// src/app/auth/signin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

const BACKEND_URL = "http://localhost:8000/api";

export default function AuthSignIn() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const syncUserWithBackend = async (user: any) => {
    try {
      console.log("Syncing user with backend:", user);
      
      // Determine provider from user metadata
      const provider = user.app_metadata?.provider || 'oauth';
      
      const userData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        picture: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        provider: provider
      };

      const response = await fetch(`${BACKEND_URL}/auth/sync-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User synced with backend:", result);
      } else {
        console.error("Failed to sync user with backend:", response.statusText);
      }
    } catch (error) {
      console.error("Error syncing user with backend:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log("AuthSignIn - Initial session:", session);
      console.log("AuthSignIn - Current URL:", window.location.href);
      console.log("AuthSignIn - URL search params:", window.location.search);
      
      // Try to get the current session
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      console.log("AuthSignIn - Current session from getSession:", currentSession);
      console.log("AuthSignIn - Error:", error);
      
      if (currentSession) {
        // User is authenticated, sync with backend
        console.log("User authenticated, syncing with backend");
        await syncUserWithBackend(currentSession.user);
        router.replace("/practice");
        setIsLoading(false);
        return;
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("AuthSignIn - Auth state change:", event, session);
        if (event === 'SIGNED_IN' && session) {
          console.log("User signed in via auth state change, syncing with backend");
          syncUserWithBackend(session.user);
          router.replace("/practice");
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, redirecting to signin");
          router.replace("/signin");
          setIsLoading(false);
        }
      });

      // Wait a bit for the session to be established
      console.log("No session found, waiting for auth state change...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // If still no session after waiting, redirect to signin
      const { data: { session: finalSession } } = await supabase.auth.getSession();
      if (!finalSession) {
        console.log("Still no session after waiting, redirecting to signin");
        router.replace("/signin");
        setIsLoading(false);
      }

      // Cleanup subscription
      return () => subscription.unsubscribe();
    };

    checkAuth();
  }, [session, router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return null;
}
