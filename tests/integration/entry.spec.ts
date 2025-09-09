import { describe, it, expect, vi } from 'vitest';
import { loadLocale, t } from '../../src/services/i18n';

// spies used by the mock
const deleteWebhook = vi.fn().mockResolvedValue(true);
const getMe = vi.fn().mockResolvedValue({ id: 1, username: 'testbot' });
const launch = vi.fn().mockResolvedValue(undefined);

vi.mock('telegraf', () => {
  return {
    Telegraf: class {
      token: string;
      handlers: Record<string, Function[]> = {};
      telegram = { deleteWebhook, getMe };

      constructor(token: string) {
        this.token = token;
      }
      start(fn: Function) {
        this.handlers.start = [fn];
      }
      on(_e: string, _fn: Function) {}
      catch() {}
      async launch() {
        return launch();
      }

      // helper for the test
      async simulateStart(ctx: any) {
        await this.handlers.start?.[0]?.(ctx);
      }
    },
  };
});

// after the mock
import { startBot } from '../../src/bot/entry';

describe('startBot (integration-lite)', () => {
  it('should delete webhook, fetch bot info, launch, and reply to /start', async () => {
    loadLocale('en');

    const bot: any = await startBot('TOKEN', { adminChatId: 123 });

    expect(deleteWebhook).toHaveBeenCalled();
    expect(getMe).toHaveBeenCalled();
    expect(launch).toHaveBeenCalled();

    const ctx = { reply: vi.fn() };
    await bot.simulateStart(ctx);
    expect(ctx.reply).toHaveBeenCalledWith(t('start'));
  });
});
