import { describe, it, beforeAll, beforeEach, expect } from 'vitest';
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
    new BotController({ adminChatId: ADMIN_CHAT_ID }).wire(bot as any);
    bot.telegram.forwardMessage.mockClear();
  });

  it('replies to /start', async () => {
    const ctx = await bot.simulateStart();
    expect(ctx.reply).toHaveBeenCalledWith(t('start'));
  });

  it('forwards message to admin chat', async () => {
    await bot.simulateMessage({
      from: { id: 987, first_name: 'Harry' },
      chatId: 7777,
      messageId: 42,
    });

    expect(bot.telegram.forwardMessage).toHaveBeenCalledTimes(1);
    expect(bot.telegram.forwardMessage).toHaveBeenCalledWith(ADMIN_CHAT_ID, 7777, 42);
  });
});
