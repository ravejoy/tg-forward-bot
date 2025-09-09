import { buildApp } from '../src/webhook.js';

const app = buildApp();

export default function handler(req: any, res: any) {
  app(req, res);
}
