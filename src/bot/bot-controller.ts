import type { Telegraf, Context } from 'telegraf';
import { t } from '../services/i18n.js';
import { logger } from '../logger.js';

type Cfg = { adminChatId: number | string };

export class BotController {
  constructor(private cfg: Cfg) {}

  wire(bot: Telegraf) {
    bot.start(async (ctx) => {
      await ctx.reply(t('start'));
    });

    // forward everything as-is to admin chat
    bot.on('message', async (ctx: Context) => {
      try {
        const fromChatId = Number(ctx.chat?.id);
        const msgId = (ctx.message as any)?.message_id;
        if (fromChatId && msgId) {
          await ctx.telegram.forwardMessage(this.cfg.adminChatId, fromChatId, msgId);
        }
      } catch (err) {
        logger.error({ err }, 'forward failed');
      }
    });

    return this;
  }
}
