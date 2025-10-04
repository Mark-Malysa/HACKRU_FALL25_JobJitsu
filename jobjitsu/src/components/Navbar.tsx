// src/components/Navbar.tsx (Updated DropdownMenu with custom classes for theme, adjusted inset for scrollbar)
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="bg-transparent fixed w-full z-10 top-0">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="JobJitsu Logo"
            width={100}
            height={100}
            className="mr-2"
          />
        </Link>

        {/* Mobile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button className="hamburger-menu ml-6">
              <Menu className="h-8 w-8 text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dropdown-content w-48 mr-4">  {/* Added mr-4 to shift left of scrollbar */}
            <DropdownMenuItem asChild className="dropdown-item">
              <Link href="/questions">Questions</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="dropdown-item">
              <Link href="/features">Features</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="dropdown-item">
              <Link href="/pricing">Pricing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="dropdown-item">
              <Link href="/faq">FAQ</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="dropdown-item">
              <Link href="/resources">Resources</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button className="w-full bg-primary hover:bg-accent text-primary-foreground rounded-full">Try for free →</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-foreground/80">
          <Link href="/questions" className="hover:text-primary transition">Questions</Link>
          <Link href="/features" className="hover:text-primary transition">Features</Link>
          <Link href="/pricing" className="hover:text-primary transition">Pricing</Link>
          <Link href="/faq" className="hover:text-primary transition">FAQ</Link>
          <Link href="/resources" className="hover:text-primary transition">Resources</Link>
        </div>

        <Button className="bg-primary hover:bg-accent text-primary-foreground rounded-full px-6 hidden md:block">Try for free →</Button>
      </div>
    </nav>
  );
}