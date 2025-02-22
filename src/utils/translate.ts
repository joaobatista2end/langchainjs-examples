import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';

const apiKey = process.env.NEXT_PUBLIC_API_KEY_OPENAI;

const prompt = new SystemMessage(
  'Translate the following from Portuguese of Brazil into English'
);

export const translate = async (text: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('API key for OpenAI is not defined');
  }
  const model = new ChatOpenAI({ model: 'gpt-4', apiKey });
  const response = await model.invoke([new HumanMessage(text), prompt]);
  return response.content as string;
};

const model = new ChatOpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_API_KEY_OPENAI,
  temperature: 0.3,
  modelName: "gpt-3.5-turbo",
});

export async function translateToEnglish(content: string): Promise<string> {
  const prompt = `
Traduza este currículo para inglês profissional.
Mantenha a formatação markdown.
Adapte termos técnicos para suas versões comumente usadas em inglês.

Currículo:
${content}
`;

  const result = await model.invoke(prompt);
  return result.content.toString();
}
