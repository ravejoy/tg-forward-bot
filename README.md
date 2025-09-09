# tg-forwarder

A simple Telegram bot that forwards all user messages (text, images, videos, links) to a specified admin chat.

## Features

- Forwards text, images, videos, and links **as-is** to admin chat
- Built with **TypeScript** + **Telegraf**
- Configurable via .env (token, admin chat, locale with i18n support: en, ru, uk)
- **Vitest** tests included:
  - smoke unit tests for controller
  - integration-lite test for entry point
- Code style enforced with **ESLint** + **Prettier**
- Husky + lint-staged pre-commit checks

## Getting Started

### 1. Clone repository

```bash
git clone https://github.com/<your-username>/tg-forwarder.git
cd tg-forwarder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the project root (see `.env.example`):

```ini
BOT_TOKEN=your-telegram-bot-token
ADMIN_CHAT_ID=your-admin-chat-id
# Choose one of the supported locales: en | ru | uk
LOCALE=en
```

### 4. Run in development

```bash
npm run dev
```

### 5. Build and run in production

```bash
npm run build
npm start
```

### 6. Run tests

```bash
npm run test             # all tests
npm run test:smoke       # smoke unit tests only
npm run test:integration # integration-lite only
```

## Project structure

```
src/
  bot/        # BotController, entry point
  services/   # i18n and config
  logger.ts
  env.ts

tests/
  smoke/          # smoke unit tests
  integration/    # integration-lite tests
  _helpers/       # FakeBot and test utils
```

## QA / Automation perspective

This project demonstrates:

- **Clean separation** of production code vs. tests
- **Smoke + integration testing** with Vitest
- **Helpers & fakes** for isolated unit testing
- **CI-friendly scripts** for lint, type-check, tests
- Professional setup suitable for automation portfolios

## License

MIT
