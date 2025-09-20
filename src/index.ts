import 'dotenv/config';

import { env } from './env.js';
import { logger } from './logger.js';
import { loadLocale } from './services/i18n.js';
import { startBot } from './bot/entry.js';

async function bootstrap() {
  loadLocale(env.LOCALE);

  const bot = await startBot(env.BOT_TOKEN, { adminChatId: env.ADMIN_CHAT_ID });
  logger.info({ locale: env.LOCALE }, 'Bot is running');

  const stop = async () => {
    logger.info('Stopping bot...');
    await bot.stop();
    process.exit(0);
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

bootstrap().catch((err) => {
  logger.error(err, 'Failed to start');
  process.exit(1);
});
