import fs from 'fs';
import path from 'path';

type Dict = Record<string, string>;

let dict: Dict = {};
let fallback: Dict = {};

// Simple template interpolation: replaces #{name} with params.name
function interpolate(s: string, params?: Record<string, string | number>) {
  if (!params) return s;
  return s.replace(/#\{(\w+)\}/g, (_, k) => String(params[k] ?? `#{${k}}`));
}

export function loadLocale(code: string) {
  const safe = ['en', 'ru', 'uk'].includes(code) ? code : 'en';
  const base = path.join(process.cwd(), 'locales');

  const enPath = path.join(base, 'en.json');
  fallback = JSON.parse(fs.readFileSync(enPath, 'utf-8')) as Dict;

  const locPath = path.join(base, `${safe}.json`);
  dict = JSON.parse(fs.readFileSync(locPath, 'utf-8')) as Dict;
}

export function t(key: string, params?: Record<string, string | number>) {
  const raw = key in dict ? dict[key] : (fallback[key] ?? key);
  return interpolate(raw, params);
}
