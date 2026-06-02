import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});
