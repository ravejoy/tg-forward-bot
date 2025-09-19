import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { BotController } from '../../src/bot/bot-controller';
import { loadLocale, t } from '../../src/services/i18n';
import { FakeBot } from '../_helpers/fake-bot';

const ADMIN_CHAT_ID = 123456;

describe('BotController (smoke)', () => {
  let bot: FakeBot;

  beforeAll(() => {
    loadLocale('en');
  });

  beforeEach(() => {
    bot = new FakeBot();
    // @ts-expect-error FakeBot matches the minimal Telegraf surface for tests
    new BotController({ adminChatId: ADMIN_CHAT_ID }).wire(bot);
  });

  it('should reply with start message on /start', async () => {
    const ctx: any = { reply: vi.fn() };
    await bot.trigger('start', ctx);
    expect(ctx.reply).toHaveBeenCalledWith(t('start'));
  });

  it('should forward text as-is and thank the user', async () => {
    const ctx: any = {
      from: { id: 1 },
      message: { text: 'hello world' },
      telegram: { sendMessage: vi.fn() },
      reply: vi.fn(),
    };
    await bot.trigger('text', ctx);
    expect(ctx.telegram.sendMessage).toHaveBeenCalledWith(ADMIN_CHAT_ID, 'hello world');
    expect(ctx.reply).toHaveBeenCalledWith(t('thanks'));
  });

  it('should forward the largest image with caption and thank the user', async () => {
    const ctx: any = {
      from: { id: 1 },
      message: { photo: [{ file_id: 'a' }, { file_id: 'b' }], caption: 'nice' },
      telegram: { sendPhoto: vi.fn() },
      reply: vi.fn(),
    };
    await bot.trigger('photo', ctx);
    expect(ctx.telegram.sendPhoto).toHaveBeenCalledWith(ADMIN_CHAT_ID, 'b', { caption: 'nice' });
    expect(ctx.reply).toHaveBeenCalledWith(t('thanks'));
  });

  it('should forward a video with caption and thank the user', async () => {
    const ctx: any = {
      from: { id: 1 },
      message: { video: { file_id: 'vid1' }, caption: 'watch' },
      telegram: { sendVideo: vi.fn() },
      reply: vi.fn(),
    };
    await bot.trigger('video', ctx);
    expect(ctx.telegram.sendVideo).toHaveBeenCalledWith(ADMIN_CHAT_ID, 'vid1', {
      caption: 'watch',
    });
    expect(ctx.reply).toHaveBeenCalledWith(t('thanks'));
  });

  it('should reply with error for unsupported message types', async () => {
    const ctx: any = {
      from: { id: 1 },
      message: { sticker: { file_id: 's1' } },
      reply: vi.fn(),
    };
    await bot.trigger('message', ctx);
    expect(ctx.reply).toHaveBeenCalledWith(t('error'));
  });
});
