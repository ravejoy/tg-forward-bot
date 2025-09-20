import type { Telegraf, Context } from 'telegraf';
import { formatUserInfo } from '../services/format';
import { t } from '../services/i18n';
import { logger } from '../logger';

type Cfg = { adminChatId: number | string };

export class BotController {
  constructor(private cfg: Cfg) {}

  wire(bot: Telegraf) {
    bot.start(async (ctx) => {
      await ctx.reply(t('start'));
    });

    // one catch-all: any user message
    bot.on('message', async (ctx: Context) => {
      try {
        // 1) meta about sender
        const meta = formatUserInfo({
          id: Number(ctx.from?.id ?? 0),
          first_name: ctx.from?.first_name,
          last_name: ctx.from?.last_name,
          username: ctx.from?.username,
        });

        await ctx.telegram.sendMessage(this.cfg.adminChatId, meta);

        // 2) forward original message
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
