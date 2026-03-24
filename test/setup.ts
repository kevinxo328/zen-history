import { vi } from 'vitest';

export const browserMock = {
  history: {
    search: vi.fn(),
    deleteRange: vi.fn(),
    deleteUrl: vi.fn()
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).browser = browserMock;
