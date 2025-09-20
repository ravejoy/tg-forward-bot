export type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};

export function formatUserInfo(user: TgUser): string {
  const first = (user.first_name ?? '').trim();
  const last = (user.last_name ?? '').trim();
  const name = [first, last].filter(Boolean).join(' ') || 'Unknown';
  const username = user.username ? ` (@${user.username})` : '';
  return `From: ${name}${username} (id:${user.id})`;
}
