// Exemple de test e2e Playwright pour le parcours utilisateur principal
// 
import { test, expect } from '@playwright/test';

test('Parcours utilisateur complet', async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('http://localhost:3000');
    // Cliquer sur le bouton de login GitHub
    await expect(page.getByRole('link', { name: /Se connecter avec GitHub/i })).toBeVisible();
    // (Ici, il faudrait mocker ou automatiser l'OAuth, sinon ce test sera semi-automatique)
    // await page.getByRole('link', { name: /Se connecter avec GitHub/i }).click();
    // await page.waitForURL(/dashboard/);

    // Aller à la page projets
    await page.goto('http://localhost:3000/projects');
    await expect(page.getByText(/Mes projets GitHub/i)).toBeVisible();

    // Vérifier la présence du bouton "Nouveau projet"
    await expect(page.getByRole('link', { name: /Nouveau projet/i })).toBeVisible();

    // (Pour tester la création de projet, il faudrait automatiser le formulaire et mocker l'API GitHub)
    // await page.getByRole('link', { name: /Nouveau projet/i }).click();
    // ...

    // Vérifier la présence des boutons Codespaces sur les projets
    await expect(page.getByRole('button', { name: /Codespaces/i })).toBeVisible();
});
