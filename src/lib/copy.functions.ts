import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { SYSTEM_PROMPT, buildUserPrompt, COPY_TOOL } from "./copy-prompt";

const InputSchema = z.object({
  text: z.string().min(1),
  format: z.string().min(1),
  tone: z.string().min(1),
});

export type AdaptedCopy = {
  titulo_principal: string;
  subtitulo: string;
  cta: string;
  versao_curta: string;
  versao_ultra_curta: string;
  legenda_opcional: string;
  hierarquia_visual: string;
  observacoes_designer: string;
};

export const adaptCopy = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AdaptedCopy> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("A chave de IA não está configurada. Tente novamente mais tarde.");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(data.text, data.format, data.tone) },
        ],
        tools: [COPY_TOOL],
        tool_choice: { type: "function", function: { name: "entregar_copy" } },
      }),
    });

    if (response.status === 429) {
      throw new Error("Muitas solicitações agora. Aguarde alguns instantes e tente de novo.");
    }
    if (response.status === 402) {
      throw new Error("Os créditos de IA acabaram. Adicione créditos para continuar usando.");
    }
    if (!response.ok) {
      const detail = await response.text();
      console.error("AI gateway error", response.status, detail);
      throw new Error("Não foi possível adaptar a copy agora. Tente novamente.");
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: { tool_calls?: Array<{ function?: { arguments?: string } }> };
      }>;
    };

    const args = payload.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) {
      throw new Error("A IA não retornou uma copy estruturada. Tente novamente.");
    }

    try {
      return JSON.parse(args) as AdaptedCopy;
    } catch {
      throw new Error("Não foi possível ler a resposta da IA. Tente novamente.");
    }
  });