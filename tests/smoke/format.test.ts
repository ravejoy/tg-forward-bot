import { describe, it, expect } from 'vitest';
import { formatUserInfo } from '../../src/services/format';

describe('formatUserInfo', () => {
  it('formats full name + username + id', () => {
    const result = formatUserInfo({
      id: 123,
      first_name: 'Harry',
      last_name: 'Potter',
      username: 'thechosenone',
    });
    expect(result).toBe('From: Harry Potter (@thechosenone) (id:123)');
  });

  it('handles missing last name', () => {
    const result = formatUserInfo({
      id: 123,
      first_name: 'Harry',
      username: 'scarboy',
    });
    expect(result).toBe('From: Harry (@scarboy) (id:123)');
  });

  it('handles missing username', () => {
    const result = formatUserInfo({
      id: 123,
      first_name: 'Hermione',
      last_name: 'Granger',
    });
    expect(result).toBe('From: Hermione Granger (id:123)');
  });

  it('handles completely empty names', () => {
    const result = formatUserInfo({ id: 999 });
    expect(result).toBe('From: Unknown (id:999)');
  });
});
