// Test d'accès à la page dashboard (UI)
import { test, expect } from '@playwright/test';

test('Dashboard accessible après login', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await expect(page.getByText(/dashboard/i)).toBeVisible();
});
