import request from "supertest";

// Exemple de test d'intégration pour l'API /api/repos
// (à adapter selon la config de test et le framework utilisé)
describe("GET /api/repos", () => {
    it("doit refuser l'accès sans authentification", async () => {
        const res = await request("http://localhost:3000").get("/api/repos");
        expect(res.status).toBe(401);
        expect(res.body.ok).toBe(false);
    });

    // Pour tester avec authentification, il faut mocker ou injecter un token valide
    // it("doit retourner la liste des repos pour un utilisateur authentifié", async () => {
    //   const res = await request("http://localhost:3000")
    //     .get("/api/repos")
    //     .set("Cookie", `github_access_token=...`);
    //   expect(res.status).toBe(200);
    //   expect(res.body.ok).toBe(true);
    //   expect(Array.isArray(res.body.data.repos)).toBe(true);
    // });
});
