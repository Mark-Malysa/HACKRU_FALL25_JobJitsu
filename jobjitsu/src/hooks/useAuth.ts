import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export function useAuth(redirectTo?: string) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (session) {
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          // Try to get session directly from Supabase
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();
          
          if (currentSession) {
            setIsAuthenticated(true);
            setIsLoading(false);
          } else {
            setIsAuthenticated(false);
            setIsLoading(false);
            
            // Redirect if specified
            if (redirectTo) {
              router.push(redirectTo);
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
        
        if (redirectTo) {
          router.push(redirectTo);
        }
      }
    };

    checkAuth();
  }, [session, supabase, router, redirectTo]);

  return {
    session,
    isAuthenticated,
    isLoading,
    user: session?.user || null
  };
}

export function useAuthRedirect(redirectTo: string) {
  const { isAuthenticated, isLoading } = useAuth(redirectTo);
  
  return {
    isAuthenticated,
    isLoading
  };
}
