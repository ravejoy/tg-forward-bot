import 'dotenv/config';

import { env } from './env';
import { logger } from './logger';
import { loadLocale } from './services/i18n';
import { startBot } from './bot/entry';

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
