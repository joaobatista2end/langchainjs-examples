import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

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
