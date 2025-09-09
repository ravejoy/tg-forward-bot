import { z } from 'zod';

const schema = z.object({
  BOT_TOKEN: z.string(),
  ADMIN_CHAT_ID: z.union([z.string(), z.number()]),
  LOCALE: z.enum(['en', 'ru', 'uk']).default('en'),
  WEBHOOK_SECRET: z.string().default('tg-webhook'),
});

export const env = schema.parse(process.env);
