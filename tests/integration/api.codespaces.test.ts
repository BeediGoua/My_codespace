import request from "supertest";

describe("GET /api/codespaces", () => {
    it("doit refuser sans owner/repo", async () => {
        const res = await request("http://localhost:3000").get("/api/codespaces");
        expect(res.status).toBe(400);
        expect(res.body.ok).toBe(false);
    });
    // Ajouter un test avec owner/repo et authentification pour tester la récupération réelle
});
