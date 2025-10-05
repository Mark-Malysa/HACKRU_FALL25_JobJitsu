// src/app/auth/signin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api";

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
      
      // Check if this is a page refresh (no URL params) vs OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const isOAuthCallback = urlParams.has('code') || urlParams.has('state') || hashParams.has('access_token');
      
      console.log("AuthSignIn - Is OAuth callback:", isOAuthCallback);
      console.log("AuthSignIn - URL params:", Object.fromEntries(urlParams.entries()));
      console.log("AuthSignIn - Hash params:", Object.fromEntries(hashParams.entries()));
      console.log("AuthSignIn - Full URL:", window.location.href);
      console.log("AuthSignIn - Hash:", window.location.hash);
      console.log("AuthSignIn - Search:", window.location.search);
      
      // If we have a session, process it regardless of OAuth callback detection
      if (session) {
        console.log("Session found, processing user");
        await syncUserWithBackend(session.user);
        router.replace("/practice");
        setIsLoading(false);
        return;
      }
      
      // If this is not an OAuth callback and no session, redirect to signin immediately
      if (!isOAuthCallback) {
        console.log("Not an OAuth callback, redirecting to signin");
        router.replace("/signin");
        setIsLoading(false);
        return;
      }
      
      // If we reach here, it's an OAuth callback - wait for session
      console.log("OAuth callback confirmed, processing...");
      
      // For OAuth callbacks, wait a bit for the session to be established
      console.log("OAuth callback detected, waiting for session...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to get the current session after waiting
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      console.log("AuthSignIn - Current session from getSession:", currentSession);
      console.log("AuthSignIn - Error:", error);
      
      if (currentSession) {
        // User is authenticated
        console.log("User authenticated, syncing with backend");
        await syncUserWithBackend(currentSession.user);
        router.replace("/practice");
        setIsLoading(false);
        return;
      }
      
      // Set up auth state change listener for OAuth callback
      let authStateHandled = false;
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("AuthSignIn - Auth state change:", event, session);
        if (event === 'SIGNED_IN' && session && !authStateHandled) {
          authStateHandled = true;
          console.log("User signed in via auth state change, syncing with backend");
          await syncUserWithBackend(session.user);
          router.replace("/practice");
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, redirecting to signin");
          router.replace("/signin");
          setIsLoading(false);
        }
      });

      // Wait for OAuth callback to complete
      console.log("OAuth callback detected, waiting for auth state change...");
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // If still no session after waiting, redirect to signin
      if (!authStateHandled) {
        const { data: { session: finalSession } } = await supabase.auth.getSession();
        if (!finalSession) {
          console.log("Still no session after OAuth callback, redirecting to signin");
          router.replace("/signin");
          setIsLoading(false);
        } else {
          console.log("Session found after waiting, syncing with backend");
          await syncUserWithBackend(finalSession.user);
          router.replace("/practice");
          setIsLoading(false);
        }
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
