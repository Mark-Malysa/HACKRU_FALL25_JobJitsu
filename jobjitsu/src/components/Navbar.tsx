// src/components/Navbar.tsx (Updated: Logo left, links center, button right; Hamburger for mobile)
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <nav className="bg-white shadow-soft fixed w-full z-10 top-0">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center">
          <span className="mr-1">✨</span> JobJitsu {/* Logo with emoji like Confetto */}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-foreground hover:text-primary transition">Home</Link>
          <Link href="/practice" className="text-foreground hover:text-primary transition">Practice Problems</Link>
          <Link href="/profile" className="text-foreground hover:text-primary transition">Profile</Link>
        </div>

        <Button className="button-primary hidden md:block">Try for free</Button> {/* Right button */}

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
              <Button className="button-primary">Try for free</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}