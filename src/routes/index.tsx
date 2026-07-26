import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CopyResultCard } from "@/components/CopyResultCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adaptCopy, type AdaptedCopy } from "@/lib/copy.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COPYshape.AI — Copies prontas para design" },
      {
        name: "description",
        content:
          "Cole um briefing ou texto bruto e receba título, subtítulo, CTA e variações curtas prontas para posts, stories, banners e anúncios.",
      },
      { property: "og:title", content: "COPYshape.AI — Copies prontas para design" },
      {
        property: "og:description",
        content:
          "Cole um briefing ou texto bruto e receba título, subtítulo, CTA e variações curtas prontas para peças de design.",
      },
    ],
  }),
  component: Index,
});

const FORMATOS = [
  "Post Instagram",
  "Story",
  "Banner",
  "Anúncio",
  "Thumbnail",
  "Carrossel",
  "Landing Page",
  "WhatsApp",
  "E-mail curto",
];

const TONS = [
  "Direto",
  "Elegante",
  "Vendedor",
  "Premium",
  "Descontraído",
  "Institucional",
  "Urgente",
  "Minimalista",
];

const CAMPOS: Array<{ key: keyof AdaptedCopy; label: string; hint?: string }> = [
  { key: "titulo_principal", label: "Título principal" },
  { key: "subtitulo", label: "Subtítulo" },
  { key: "cta", label: "CTA" },
  { key: "versao_curta", label: "Versão curta" },
  { key: "versao_ultra_curta", label: "Versão ultra curta", hint: "Até 5 palavras" },
  { key: "legenda_opcional", label: "Legenda opcional" },
  { key: "hierarquia_visual", label: "Hierarquia visual", hint: "Sugestão de tamanhos" },
  { key: "observacoes_designer", label: "Observações para o designer" },
];

function Index() {
  const runAdaptCopy = useServerFn(adaptCopy);
  const [text, setText] = useState("");
  const [format, setFormat] = useState(FORMATOS[0]);
  const [tone, setTone] = useState(TONS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdaptedCopy | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Cole um texto antes de adaptar.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await runAdaptCopy({ data: { text: text.trim(), format, tone } });
      setResult(data);
      toast.success("Copy adaptada com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Algo deu errado ao adaptar a copy.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex items-center justify-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl btn-gradient">
              <Sparkles className="size-5 text-on-gradient" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              COPYshape<span className="text-primary">.AI</span>
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Transforme textos longos em copies prontas para design.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Cole um briefing, uma legenda confusa ou uma ideia bruta. Escolha o formato e o tom, e
            receba oito variações curtas e organizadas para usar direto na sua peça.
          </p>
        </header>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-border/60 bg-card/50 p-6 backdrop-blur sm:p-8">
            <div className="space-y-3">
              <Label htmlFor="texto" className="text-sm font-medium text-foreground">
                Texto original
              </Label>
              <Textarea
                id="texto"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Cole aqui o texto do cliente, briefing, legenda ou ideia bruta…"
                className="min-h-[260px] resize-y rounded-xl border-border/60 bg-background/60 text-sm leading-relaxed"
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Formato</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/60">
                    <SelectValue placeholder="Escolha o formato" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {FORMATOS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Tom</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/60">
                    <SelectValue placeholder="Escolha o tom" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {TONS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="hero"
              size="hero"
              className="mt-7 w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {loading ? "Adaptando sua copy…" : "Adaptar copy"}
            </Button>
          </section>

          <section aria-live="polite">
            {loading ? (
              <div className="flex h-full min-h-[420px] items-center justify-center rounded-3xl border border-border/60 bg-card/40 backdrop-blur">
                <Loader2 className="size-7 animate-spin text-primary" />
              </div>
            ) : result ? (
              <div className="space-y-4">
                {CAMPOS.map((campo) => (
                  <CopyResultCard
                    key={campo.key}
                    label={campo.label}
                    hint={campo.hint}
                    value={result[campo.key]}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/60 bg-card/30 p-8 text-center backdrop-blur">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-surface-elevated">
                  <Sparkles className="size-5 text-primary" />
                </span>
                <p className="text-sm text-muted-foreground">Cole um texto para começar.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
