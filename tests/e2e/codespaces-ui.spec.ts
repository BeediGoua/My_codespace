// Test d'affichage des Codespaces dans la page projets (UI)
import { test, expect } from '@playwright/test';

test('Affichage Codespaces sur chaque projet', async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
    // Vérifie qu'au moins un bloc "Codespaces existants" est visible
    await expect(page.getByText(/Codespaces existants/i)).toBeVisible();
});
