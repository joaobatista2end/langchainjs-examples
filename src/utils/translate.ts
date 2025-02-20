import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const translate = async (text: string): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY_OPENAI;
  if (!apiKey) {
    throw new Error("API key for OpenAI is not defined");
  }

  const model = new ChatOpenAI({ model: "gpt-4", apiKey });

  const messages = [
    new SystemMessage("Translate the following from Portuguese of Brazil into English"),
    new HumanMessage(text)
  ];

  const response = await model.invoke(messages);

  return response.content as string;
};