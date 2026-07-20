import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // `server-only` is a bundler guard that throws when run in Node (vitest).
      // Alias it to its own no-op entry so server modules can be unit-tested.
      'server-only': path.resolve(__dirname, '../node_modules/server-only/empty.js'),
    },
  },
});
