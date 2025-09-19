const HEADER_PREFIX = 'From:';
const USERNAME_PREFIX = '@';
const ID_PREFIX = 'id:';
const UNKNOWN = 'unknown';
const TYPE_PREFIX = 'Type:';

const MSG_TYPES: Record<string, string> = {
  text: 'text',
  photo: 'photo',
  video: 'video',
  audio: 'audio',
  document: 'document',
  voice: 'voice',
  video_note: 'video_note',
  sticker: 'sticker',
  location: 'location',
  contact: 'contact',
  poll: 'poll',
};

export function formatSender(from?: {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}) {
  if (!from) return `${HEADER_PREFIX} ${UNKNOWN}`;
  const fullName = [from.first_name, from.last_name].filter(Boolean).join(' ').trim() || UNKNOWN;
  const parts = [
    `${HEADER_PREFIX} ${fullName}`,
    from.username ? `(${USERNAME_PREFIX}${from.username})` : '',
    `(${ID_PREFIX}${from.id})`,
  ].filter(Boolean);
  return parts.join(' ');
}

export function detectType(msg: any): string {
  if (!msg) return UNKNOWN;
  if (msg.text) return MSG_TYPES.text;
  if (msg.photo) return MSG_TYPES.photo;
  if (msg.video) return MSG_TYPES.video;
  if (msg.audio) return MSG_TYPES.audio;
  if (msg.document) return MSG_TYPES.document;
  if (msg.voice) return MSG_TYPES.voice;
  if (msg.video_note) return MSG_TYPES.video_note;
  if (msg.sticker) return MSG_TYPES.sticker;
  if (msg.location) return MSG_TYPES.location;
  if (msg.contact) return MSG_TYPES.contact;
  if (msg.poll) return MSG_TYPES.poll;
  return UNKNOWN;
}

export function formatHeader(from: any, msg: any): string {
  return `${formatSender(from)}\n${TYPE_PREFIX} ${detectType(msg)}`;
}
