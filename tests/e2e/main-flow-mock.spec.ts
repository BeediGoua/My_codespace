// Test e2e complet avec mocks (login, création projet, Codespaces)
import { test, expect } from './helpers/auth';

test('Parcours utilisateur complet mocké', async ({ page, context }) => {
    // Aller à la page d'accueil (session déjà injectée)
    await page.goto('http://localhost:3000');
    await expect(page.getByText(/Codespace Launcher/i)).toBeVisible();

    // Aller à la page projets
    await page.goto('http://localhost:3000/projects');
    await expect(page.getByText(/Mes projets GitHub/i)).toBeVisible();

    // Aller à la page de création de projet
    await page.goto('http://localhost:3000/projects/create');
    await expect(page.getByText(/Description du projet/i)).toBeVisible();

    // Remplir et soumettre le formulaire de création de projet
    await page.fill('input[name="repo-name"]', 'projet-e2e');
    await page.fill('textarea[name="repo-description"]', 'Projet de test e2e');
    await page.click('button[type="submit"]');

    // Vérifier la redirection et la présence du projet mocké
    await expect(page).toHaveURL(/projects/);
    await expect(page.getByText(/projet-e2e/i)).toBeVisible();

    // Vérifier la présence du bloc Codespaces mocké
    await expect(page.getByText(/Codespaces existants/i)).toBeVisible();
    await expect(page.getByText(/Codespace de test/i)).toBeVisible();
});
