import { vi } from 'vitest';

export const browserMock = {
  history: {
    search: vi.fn(),
    deleteRange: vi.fn(),
    deleteUrl: vi.fn()
  },
  browsingData: {
    remove: vi.fn()
  },
  runtime: {
    sendMessage: vi.fn(),
    openOptionsPage: vi.fn()
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).browser = browserMock;

// Mock localStorage
global.localStorage = {
  state: {},
  setItem(key: string, value: string) {
    this.state[key] = value;
  },
  getItem(key: string) {
    return this.state[key] || null;
  },
  removeItem(key: string) {
    delete this.state[key];
  },
  clear() {
    this.state = {};
  },
  length: 0,
  key(index: number) {
    return Object.keys(this.state)[index] || null;
  }
} as any;
