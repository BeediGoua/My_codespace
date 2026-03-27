// Helper Playwright pour injecter un cookie de session de test
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
    storageState: async ({ }, use) => {
        // Simule une session authentifiée en injectant le cookie github_access_token
        await use({
            cookies: [
                {
                    name: 'github_access_token',
                    value: 'test-token',
                    domain: 'localhost',
                    path: '/',
                    httpOnly: true,
                    secure: false,
                    sameSite: 'Lax',
                    expires: Date.now() / 1000 + 3600,
                },
            ],
        });
    },
});
export { expect };
