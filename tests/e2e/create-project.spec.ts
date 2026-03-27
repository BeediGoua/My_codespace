// Test d'accès à la page de création de projet (UI)
import { test, expect } from '@playwright/test';

test('Page création projet accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/projects/create');
    await expect(page.getByText(/Description du projet/i)).toBeVisible();
});
