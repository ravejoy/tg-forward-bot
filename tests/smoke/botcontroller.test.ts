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
    bot.telegram.sendMessage.mockClear();
    bot.telegram.forwardMessage.mockClear();
  });

  it('replies to /start', async () => {
    const ctx = await bot.simulateStart();
    expect(ctx.reply).toHaveBeenCalledWith(t('start'));
  });

  it('sends sender meta and then forwards message', async () => {
    const user = { id: 987, first_name: 'Harry', last_name: 'Potter', username: 'thechosenone' };
    await bot.simulateMessage({ from: user, chatId: 7777, messageId: 42 });

    expect(bot.telegram.sendMessage).toHaveBeenCalledTimes(1);
    expect(bot.telegram.sendMessage.mock.calls[0][0]).toBe(ADMIN_CHAT_ID);
    expect(bot.telegram.sendMessage.mock.calls[0][1]).toMatch(
      /^From: Harry Potter \( @thechosenone\) \(id:987\)|^From: Harry Potter \(@thechosenone\) \(id:987\)$/,
    );

    expect(bot.telegram.forwardMessage).toHaveBeenCalledTimes(1);
    expect(bot.telegram.forwardMessage).toHaveBeenCalledWith(ADMIN_CHAT_ID, 7777, 42);
  });
});
