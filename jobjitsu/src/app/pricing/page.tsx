"use client";
import { useAuthRedirect } from "@/hooks/useAuth";

export default function Pricing() {
  const { isAuthenticated, isLoading } = useAuthRedirect("/signin");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to signin
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p>View our pricing plans. (Coming soon)</p>
    </div>
  );
}