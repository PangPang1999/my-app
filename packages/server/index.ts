import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// 使用 Map 保存 conversationId 与 lastResponseId 的映射
const conversations = new Map<string, string>();

app.post('/api/chat', async (req: Request, res: Response) => {
  const { prompt, conversationsId } = req.body;

  const responses = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
    previous_response_id: conversations.get(conversationsId),
  });
  conversations.set(conversationsId, responses.id);
  res.json({ message: responses.output_text });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
