import { INTENTS } from "../config/intent.config";
import { PARAMS_SYSTEM } from "../config/params.config";

const intentsList = Object.entries(INTENTS)
  .map(([key, value]) => `- ${key}: ${value.description}`)
  .join('\n');

const paramsList = Object.entries(PARAMS_SYSTEM)
  .map(([key, value]) => {
    const allowed = 'allowedValues' in value && value.allowedValues
      ? `Valores Permitidos:\n${value.allowedValues.map(v => `  - ${v}`).join('\n')}`
      : '';

    return `- ${key}
  Descrição: ${value.description}
  ${allowed}
`;
  })
  .join('\n');

export const buildUserPrompt = (question: string) => `
    Intenções possíveis:
    ${intentsList}

    Parâmetros possíveis:
    ${paramsList}

    Pergunta do usuário:
    "${question}"
`;

export const buildAnalyzePostsPrompt = (
  question: string,
  formattedPosts: { id: number; title: string; content: string }[]
) => `
  Pergunta do usuário:
  "${question}"

  Posts disponíveis:
  ${JSON.stringify(formattedPosts, null, 2)}

  Responda apenas em JSON válido no formato:

  {
    "found": boolean,
    "postIds": number[],
  }

  Regras:
  - found = true se algum post responder ou mencionar o assunto da pergunta,
    mesmo que com variações de palavras (ex: "remarcação" e "remarcada").
  - Considere equivalência semântica.
  - Use apenas os dados fornecidos
`;