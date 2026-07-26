import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CopyResultCardProps {
  label: string;
  hint?: string;
  value: string;
}

export function CopyResultCard({ label, hint, value }: CopyResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Não foi possível copiar. Copie manualmente.");
    }
  };

  return (
    <article className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur transition-colors hover:border-primary/40">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {hint ? <p className="mt-0.5 text-[11px] text-muted-foreground/70">{hint}</p> : null}
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="rounded-xl">
          {copied ? <Check /> : <Copy />}
          {copied ? "Copiado" : "Copiar"}
        </Button>
      </header>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{value}</p>
    </article>
  );
}