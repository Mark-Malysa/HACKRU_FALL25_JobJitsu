// src/components/ModePicker.tsx (Corrected: Fixed unbalanced tags, removed invalid div, added missing imports, removed async in JSX, fixed biasMode/setBiasMode)
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Added missing import
import { toast } from "sonner";

export function ModePicker({ onStart }: { onStart?: (mode: string, company?: string, role?: string, biasMode?: string) => void }) {
  const [mode, setMode] = useState("general");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [biasMode, setBiasMode] = useState("off"); // Fixed missing biasMode/setBiasMode
  const router = useRouter(); // Fixed missing router

  const handleStart = () => {
    fetch("/session/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, company, role, biasMode }), // Fixed biasMode reference
    })
      .then((res) => res.json())
      .then((session) => {
        toast.success("Session created!");
        router.push(`/interview/session/${session.id}`);
        if (onStart) onStart(mode, company, role, biasMode);
      })
      .catch(() => toast.error("Failed to start session"));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="button-primary">Start Practice</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-soft bg-card border-border"> {/* Moved class to DialogContent */}
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-foreground">Select Mode</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mode" className="text-right text-muted-foreground">Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="col-span-3 bg-input border-border text-foreground">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="general">General Practice</SelectItem>
                <SelectItem value="company">Company + Role</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {mode === "company" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right text-muted-foreground">Company</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="col-span-3 bg-input border-border text-foreground" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right text-muted-foreground">Role</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="col-span-3 bg-input border-border text-foreground" />
              </div>
            </>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bias" className="text-right text-muted-foreground">Bias Mode</Label>
            <Select value={biasMode} onValueChange={setBiasMode}> {/* Fixed biasMode/setBiasMode */}
              <SelectTrigger className="col-span-3 bg-input border-border text-foreground">
                <SelectValue placeholder="Select bias mode" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="subtle">Subtle</SelectItem>
                <SelectItem value="overt">Overt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleStart} className="w-full button-primary">Begin Session</Button> {/* Fixed handleStart reference */}
      </DialogContent>
    </Dialog>
  );
}