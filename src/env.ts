import { z } from 'zod';

const schema = z.object({
  BOT_TOKEN: z.string().min(1),
  ADMIN_CHAT_ID: z.union([z.string(), z.number()]),
  LOCALE: z.enum(['ru', 'en', 'uk']).default('ru'),
});

export const env = schema.parse({
  BOT_TOKEN: process.env.BOT_TOKEN,
  ADMIN_CHAT_ID: process.env.ADMIN_CHAT_ID,
  LOCALE: process.env.LOCALE,
});
