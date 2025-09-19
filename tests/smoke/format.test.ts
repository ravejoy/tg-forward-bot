import { describe, it, expect } from 'vitest';
import { formatHeader } from '../../src/services/format';

// Test fixtures
const USER_FULL = {
  id: 42,
  first_name: 'Harry',
  last_name: 'Potter',
  username: 'chosen1',
};

const USER_NO_USERNAME = {
  id: 7,
  first_name: 'Hermione',
  // last_name omitted
  // username omitted
};

const MSG_TEXT = { text: 'Expelliarmus!' };
const MSG_PHOTO = { photo: [{ file_id: 'ph1' }] };
const MSG_VOICE = { voice: { file_id: 'v1' } };

describe('formatHeader (smoke)', () => {
  it('should format header with full name and username for text message', () => {
    const result = formatHeader(USER_FULL, MSG_TEXT);
    expect(result).toContain('From: Harry Potter (@chosen1) (id:42)');
    expect(result).toContain('Type: text');
  });

  it('should handle missing last_name and username for photo', () => {
    const result = formatHeader(USER_NO_USERNAME as any, MSG_PHOTO);
    expect(result).toContain('From: Hermione (id:7)');
    expect(result).toContain('Type: photo');
  });

  it('should fallback to unknown when sender is missing', () => {
    const result = formatHeader(undefined, MSG_VOICE);
    expect(result).toContain('From: unknown');
    expect(result).toContain('Type: voice');
  });
});
