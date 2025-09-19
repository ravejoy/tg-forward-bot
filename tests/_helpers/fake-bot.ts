// tests/_helpers/fake-bot.ts
import { vi } from 'vitest';

type Handler = (ctx: any) => any;

export class FakeBot {
  private handlers = new Map<string, Handler[]>();

  // --- Telegraf-like API that BotController uses -----------------------------

  start(fn: Handler) {
    this.add('start', fn);
    return this;
  }

  on(event: string, fn: Handler) {
    this.add(event, fn);
    return this;
  }

  telegram = {
    sendMessage: vi.fn().mockResolvedValue(undefined),
    sendPhoto: vi.fn().mockResolvedValue(undefined),
    sendVideo: vi.fn().mockResolvedValue(undefined),
    forwardMessage: vi.fn().mockResolvedValue(undefined),
    copyMessage: vi.fn().mockResolvedValue(undefined),
  };

  // --- Helpers for tests -----------------------------------------------------

  async trigger(event: string, ctx: Partial<any> = {}) {
    const baseCtx = this.buildCtx(ctx);
    const hs = this.handlers.get(event) ?? [];
    for (const h of hs) {
      await h(baseCtx);
    }
  }

  async simulateStart(ctx: Partial<any> = {}) {
    await this.trigger('start', ctx);
  }

  // --- Internal --------------------------------------------------------------

  private add(event: string, fn: Handler) {
    const list = this.handlers.get(event) ?? [];
    list.push(fn);
    this.handlers.set(event, list);
  }

  private buildCtx(ctx: Partial<any>) {
    const reply = vi.fn().mockResolvedValue(undefined);

    const telegram =
      ctx.telegram ??
      ({
        sendMessage: vi.fn().mockResolvedValue(undefined),
        sendPhoto: vi.fn().mockResolvedValue(undefined),
        sendVideo: vi.fn().mockResolvedValue(undefined),
        forwardMessage: vi.fn().mockResolvedValue(undefined),
        copyMessage: vi.fn().mockResolvedValue(undefined),
      } as const);

    const from = ctx.from ?? { id: 111, is_bot: false, first_name: 'Test', username: 'test_user' };
    const chat = ctx.chat ?? { id: 222, type: 'private' };

    return {
      reply,
      telegram,
      from,
      chat,
      ...ctx,
    };
  }
}

export default FakeBot;
