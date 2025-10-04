// src/components/Navbar.tsx
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";  // Added
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Navbar() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out!");
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-soft fixed w-full z-10 top-0">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center">
          <span className="mr-1">✨</span> JobJitsu
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-foreground hover:text-primary transition">Home</Link>
          <Link href="/practice" className="text-foreground hover:text-primary transition">Practice Problems</Link>
          <Link href="/profile" className="text-foreground hover:text-primary transition">Profile</Link>
        </div>

        {session ? (
          <Button onClick={handleSignOut} className="button-primary hidden md:block">Sign Out</Button>
        ) : (
          <Link href="/auth/signin">
            <Button className="button-primary hidden md:block">Sign In / Up</Button>
          </Link>
        )}

        {/* Mobile Hamburger */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px]">
            <div className="flex flex-col space-y-4 mt-6">
              <Link href="/" className="text-foreground hover:text-primary transition">Home</Link>
              <Link href="/practice" className="text-foreground hover:text-primary transition">Practice Problems</Link>
              <Link href="/profile" className="text-foreground hover:text-primary transition">Profile</Link>
              {session ? (
                <Button onClick={handleSignOut} className="button-primary">Sign Out</Button>
              ) : (
                <Link href="/auth/signin">
                  <Button className="button-primary">Sign In / Up</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}