export class FakeBot {
  handlers: Record<string, Array<(ctx: any, next?: () => Promise<void>) => any>> = {};

  start(fn: (ctx: any) => any) {
    this.handlers.start = [fn];
  }
  on(event: string, fn: (ctx: any, next?: () => Promise<void>) => any) {
    (this.handlers[event] ||= []).push(fn);
  }
  catch() {
    /* noop */
  }

  async trigger(event: string, ctx: any) {
    const list = this.handlers[event] || [];
    for (const fn of list) await fn(ctx, async () => Promise.resolve());
  }
}
