// src/components/PersonaChip.tsx
import { Badge } from "@/components/ui/badge";

interface PersonaChipProps {
  company?: string;
  role?: string;
  biasMode?: string;
}

export function PersonaChip({ company, role, biasMode }: PersonaChipProps) {
  return (
    <div className="flex space-x-2">
      {company && <Badge variant="secondary">{company}</Badge>}
      {role && <Badge variant="secondary">{role}</Badge>}
      {biasMode && biasMode !== "off" && (
        <Badge variant="destructive">Bias Mode: {biasMode}</Badge>
      )}
    </div>
  );
}