export const SYSTEM_PROMPT = `Você é um assistente especialista em copy para design gráfico, social media e publicidade visual. Sua função é transformar textos longos, confusos ou genéricos em copies curtas, claras e prontas para peças de design.

Sempre considere o formato escolhido pelo usuário e o tom desejado. O resultado deve ser útil para um designer que precisa criar uma peça rapidamente.

Não escreva textos longos demais. Priorize frases curtas, impactantes e fáceis de posicionar em layouts.

Evite: textos longos, linguagem clichê, exageros vazios, muitas opções irrelevantes, respostas genéricas.

A saída deve ser objetiva, organizada e pronta para copiar.`;

export function buildUserPrompt(text: string, format: string, tone: string) {
  return `Formato da peça: ${format}
Tom desejado: ${tone}

Texto original:
"""
${text}
"""

Adapte esse conteúdo para o formato e tom acima. Responda em português brasileiro. A versão ultra curta deve ter no máximo 5 palavras.`;
}

export const COPY_TOOL = {
  type: "function" as const,
  function: {
    name: "entregar_copy",
    description: "Entrega a copy adaptada e estruturada para uso em design.",
    parameters: {
      type: "object",
      properties: {
        titulo_principal: { type: "string", description: "Título principal impactante" },
        subtitulo: { type: "string", description: "Subtítulo de apoio" },
        cta: { type: "string", description: "Chamada para ação curta" },
        versao_curta: { type: "string", description: "Versão curta da mensagem" },
        versao_ultra_curta: { type: "string", description: "Até 5 palavras" },
        legenda_opcional: { type: "string", description: "Legenda opcional para redes sociais" },
        hierarquia_visual: {
          type: "string",
          description: "Sugestão de hierarquia e tamanhos de texto",
        },
        observacoes_designer: {
          type: "string",
          description: "Observações práticas para o designer",
        },
      },
      required: [
        "titulo_principal",
        "subtitulo",
        "cta",
        "versao_curta",
        "versao_ultra_curta",
        "legenda_opcional",
        "hierarquia_visual",
        "observacoes_designer",
      ],
      additionalProperties: false,
    },
  },
};