# tg-forward-bot

![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)
![Vercel](https://vercelbadge.vercel.app/api/ravejoy/tg-forward-bot)

A simple Telegram bot that forwards all user messages (text, images, videos, links) to a specified admin chat.

## Features
- Forwards **text, images, videos, and links** as-is to admin chat  
- Built with **TypeScript** + **Telegraf**  
- Configurable via `.env` (token, admin chat, locale with i18n support: `en`, `uk`, `ru`)  
- **Vitest** tests included:
  - smoke unit tests for controller
  - integration-lite test for entry point  
- Code style enforced with **ESLint** + **Prettier**  
- Husky + lint-staged pre-commit checks  
- Ready for deployment on **Vercel** (serverless webhook)

---

## Getting Started

### 1. Clone repository
```bash
git clone https://github.com/ravejoy/tg-forward-bot.git
cd tg-forward-bot
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
# Choose one of the supported locales: en | uk | ru
LOCALE=en
# Secret for webhook endpoint (must match Vercel URL)
WEBHOOK_SECRET=your-webhook-secret
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

---

## Deploying to Vercel

1. Push your repo to GitHub  
2. Import the repository into [Vercel](https://vercel.com)  
3. In project settings → **Environment Variables**, add:
   - `BOT_TOKEN`
   - `ADMIN_CHAT_ID`
   - `LOCALE`
   - `WEBHOOK_SECRET`  
4. Deploy project  
5. Set Telegram webhook (replace placeholders):
   ```bash
   curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook"      -H "Content-Type: application/json"      -d "{\"url\":\"https://<your-vercel-domain>.vercel.app/api/telegram/<WEBHOOK_SECRET>\"}"
   ```
6. Verify health endpoint:
   ```
   https://<your-vercel-domain>.vercel.app/api/health
   ```

---

## Project structure
```
src/
  bot/        # BotController, entry point
  services/   # i18n and config
  logger.ts
  env.ts
  webhook.ts  # Express app for Vercel

api/
  telegram.ts # Vercel serverless entry

tests/
  smoke/          # smoke unit tests
  integration/    # integration-lite tests
  _helpers/       # FakeBot and test utils
```

---

## License
MIT License

Copyright (c) 2025 Nazarii Tsyhaniuk

Permission is hereby granted, free of charge, to any person obtaining a copy...
