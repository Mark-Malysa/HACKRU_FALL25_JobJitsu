// src/components/ModePicker.tsx (Updated onStart to use /session/start)
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ModePicker({ onStart }: { onStart?: (mode: string, company?: string, role?: string, biasMode?: string) => void }) {
  const [mode, setMode] = useState("general");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [biasMode, setBiasMode] = useState("off");
  const router = useRouter();

  const handleStart = () => {
    fetch("/session/start", {  // Updated endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, company, role, biasMode }),
    })
      .then((res) => res.json())
      .then((session) => {
        toast.success("Session created!");
        router.push(`/interview/session/${session.id}`);  // Assume response has 'id'
        if (onStart) onStart(mode, company, role, biasMode);
      })
      .catch(() => toast.error("Failed to start session"));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="button-primary">Start Practice</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-soft">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Select Mode</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mode" className="text-right">Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Practice</SelectItem>
                <SelectItem value="company">Company + Role</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {mode === "company" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">Company</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="col-span-3" />
              </div>
            </>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bias" className="text-right">Bias Mode</Label>
            <Select value={biasMode} onValueChange={setBiasMode}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select bias mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="subtle">Subtle</SelectItem>
                <SelectItem value="overt">Overt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleStart} className="w-full button-primary">Begin Session</Button>
      </DialogContent>
    </Dialog>
  );
}