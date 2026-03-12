import { vi } from 'vitest';

export const browserMock = {
  history: {
    search: vi.fn(),
    deleteRange: vi.fn(),
    deleteUrl: vi.fn(),
  },
};

(global as any).browser = browserMock;
