import type { Telegraf } from 'telegraf';
import { t } from '../services/i18n.js';
import { logger } from '../logger.js';

type Cfg = { adminChatId: string | number };

export class BotController {
  constructor(private cfg: Cfg) {}

  wire(bot: Telegraf) {
    bot.start(async (ctx) => {
      await ctx.reply(t('start'));
    });

    bot.on('text', async (ctx) => {
      const text = ctx.message.text?.trim();
      if (!text) return;

      await ctx.telegram.sendMessage(this.cfg.adminChatId, text);
      logger.info({ event: 'forward_text', from: ctx.from.id });
      await ctx.reply(t('thanks'));
    });

    bot.on('photo', async (ctx) => {
      const photos = ctx.message.photo;
      const best = photos?.[photos.length - 1];
      if (!best) return;

      const caption = ctx.message.caption?.trim();
      await ctx.telegram.sendPhoto(
        this.cfg.adminChatId,
        best.file_id,
        caption ? { caption } : undefined,
      );

      logger.info({ event: 'forward_image', from: ctx.from.id });
      await ctx.reply(t('thanks'));
    });

    bot.on('video', async (ctx) => {
      const fileId = ctx.message.video?.file_id;
      if (!fileId) return;

      const caption = ctx.message.caption?.trim();
      await ctx.telegram.sendVideo(this.cfg.adminChatId, fileId, caption ? { caption } : undefined);

      logger.info({ event: 'forward_video', from: ctx.from.id });
      await ctx.reply(t('thanks'));
    });

    bot.on('message', async (ctx, next) => {
      if ('text' in ctx.message || 'photo' in ctx.message || 'video' in ctx.message) {
        return next();
      }
      logger.info({ event: 'unsupported', from: ctx.from.id, kind: ctx.updateType });
      await ctx.reply(t('error'));
    });
  }
}
