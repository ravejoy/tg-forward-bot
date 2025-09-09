import { Telegraf } from 'telegraf';
import { logger } from '../logger';
import { BotController } from './BotController';

export async function startBot(token: string, cfg: { adminChatId: string | number }) {
  if (!token) throw new Error('Missing BOT_TOKEN');

  const bot = new Telegraf(token);

  const me = await bot.telegram.getMe();
  logger.info({ me }, 'Connected to Telegram');

  await bot.telegram.deleteWebhook({ drop_pending_updates: true });

  new BotController(cfg).wire(bot);

  bot.catch((err, ctx) => {
    logger.error({ err, updateType: ctx.updateType }, 'Unhandled bot error');
  });

  await bot.launch();
  return bot;
}
