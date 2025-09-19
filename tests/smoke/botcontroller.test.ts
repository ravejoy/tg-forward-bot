import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { BotController } from '../../src/bot/bot-controller';
import { loadLocale, t } from '../../src/services/i18n';
import { FakeBot } from '../_helpers/fake-bot';

// -------- fixtures --------
const ADMIN_CHAT_ID = 123456;

const USER = { id: 777, first_name: 'Harry', username: 'chosen1' };

const TEXT_MSG = { text: 'Hello from tests' };

const PHOTO_MSG = {
  photo: [{ file_id: 'small' }, { file_id: 'medium' }, { file_id: 'large' }],
  caption: 'Photo caption',
};

const VIDEO_MSG = {
  video: { file_id: 'video-file' },
  caption: 'Video caption',
};

const STICKER_MSG = { sticker: { file_id: 'sticker-1' } };

// ------------------------------------------

describe('BotController (smoke)', () => {
  let bot: FakeBot;

  beforeAll(() => {
    loadLocale('en');
  });

  beforeEach(() => {
    bot = new FakeBot();
    new BotController({ adminChatId: ADMIN_CHAT_ID }).wire(bot);
  });

  it('should reply with start message on /start', async () => {
    const ctx: any = { from: USER, reply: vi.fn() };

    await bot.trigger('start', ctx);

    expect(ctx.reply).toHaveBeenCalledWith(t('start'));
  });

  it('should forward plain text to admin and thank the user', async () => {
    const ctx: any = {
      from: USER,
      message: TEXT_MSG,
      telegram: { sendMessage: vi.fn() },
      reply: vi.fn(),
    };

    await bot.trigger('text', ctx);

    expect(ctx.telegram.sendMessage).toHaveBeenCalledWith(ADMIN_CHAT_ID, TEXT_MSG.text);
    expect(ctx.reply).toHaveBeenCalledWith(t('thanks'));
  });

  it('should forward the largest photo with caption and thank the user', async () => {
    const ctx: any = {
      from: USER,
      message: PHOTO_MSG,
      telegram: { sendPhoto: vi.fn() },
      reply: vi.fn(),
    };

    await bot.trigger('photo', ctx);

    // expects the last (largest) photo file_id to be used
    expect(ctx.telegram.sendPhoto).toHaveBeenCalledWith(
      ADMIN_CHAT_ID,
      PHOTO_MSG.photo[PHOTO_MSG.photo.length - 1].file_id,
      { caption: PHOTO_MSG.caption },
    );
    expect(ctx.reply).toHaveBeenCalledWith(t('thanks'));
  });

  it('should forward video with caption and thank the user', async () => {
    const ctx: any = {
      from: USER,
      message: VIDEO_MSG,
      telegram: { sendVideo: vi.fn() },
      reply: vi.fn(),
    };

    await bot.trigger('video', ctx);

    expect(ctx.telegram.sendVideo).toHaveBeenCalledWith(ADMIN_CHAT_ID, VIDEO_MSG.video.file_id, {
      caption: VIDEO_MSG.caption,
    });
    expect(ctx.reply).toHaveBeenCalledWith(t('thanks'));
  });

  it('should reply with error for unsupported message types', async () => {
    const ctx: any = {
      from: USER,
      message: STICKER_MSG,
      reply: vi.fn(),
    };

    await bot.trigger('message', ctx);

    expect(ctx.reply).toHaveBeenCalledWith(t('error'));
  });
});
