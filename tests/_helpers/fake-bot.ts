import { vi } from 'vitest';

type Handler = (ctx: any) => any;

export class FakeBot {
  private startHandler?: Handler;
  private messageHandler?: Handler;

  public telegram = {
    sendMessage: vi.fn(),
    forwardMessage: vi.fn(),
  };

  start(h: Handler) {
    this.startHandler = h;
    return this;
  }
  on(event: string, h: Handler) {
    if (event === 'message') this.messageHandler = h;
    return this;
  }

  // simulate /start
  async simulateStart(ctxExtra: Partial<any> = {}) {
    const ctx = {
      reply: vi.fn(),
      ...ctxExtra,
    };
    if (!this.startHandler) throw new Error('no start handler');
    await this.startHandler(ctx);
    return ctx;
  }

  // simulate a regular message
  async simulateMessage(msg: {
    from: { id: number; first_name?: string; last_name?: string; username?: string };
    chatId?: number;
    messageId?: number;
  }) {
    const ctx = {
      from: msg.from,
      chat: { id: msg.chatId ?? 555 },
      message: { message_id: msg.messageId ?? 777 },
      telegram: this.telegram,
      reply: vi.fn(),
    };
    if (!this.messageHandler) throw new Error('no message handler');
    await this.messageHandler(ctx);
    return ctx;
  }
}
