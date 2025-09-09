import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { Telegraf } from 'telegraf';
import { BotController } from './bot/BotController.js';
import { env } from './env.js';
import { loadLocale } from './services/i18n.js';

export function buildApp() {
  loadLocale(env.LOCALE);

  const bot = new Telegraf(env.BOT_TOKEN);
  new BotController({ adminChatId: env.ADMIN_CHAT_ID }).wire(bot);

  const app = express();
  app.use(express.json());

  const secret = process.env.WEBHOOK_SECRET || 'tg-webhook';

  app.post(`/api/telegram/${secret}`, async (req: Request, res: Response) => {
    try {
      await bot.handleUpdate(req.body, res);
      if (!res.headersSent) res.status(200).end();
    } catch (err) {
      if (!res.headersSent) res.status(500).send('error');
    }
  });

  app.get('/api/health', (_req: Request, res: Response) => res.status(200).send('ok'));

  return app;
}
