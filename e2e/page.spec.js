import { test, expect } from '@playwright/test';

test('homepage loads and displays hello message', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Hello!!/i })).toBeVisible();
});
