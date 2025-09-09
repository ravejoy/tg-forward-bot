import { buildApp } from '../src/webhook';

const app = buildApp();

export default function handler(req: any, res: any) {
  app(req, res);
}
