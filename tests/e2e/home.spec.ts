// Test d'accès à la page d'accueil (UI)
import { test, expect } from '@playwright/test';

test('Accueil accessible', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText(/Codespace Launcher/i)).toBeVisible();
});
