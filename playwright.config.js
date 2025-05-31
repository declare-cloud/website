// playwright.config.js
// Basic config: test against localhost:3000
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run build && npm start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true
  }
});
