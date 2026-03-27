// Test d'erreur API Codespaces (intégration)
import request from "supertest";

describe("GET /api/codespaces", () => {
    it("retourne une erreur si owner/repo n'existe pas", async () => {
        const res = await request("http://localhost:3000").get("/api/codespaces?owner=notfound&repo=notfound");
        expect(res.status).toBeGreaterThanOrEqual(400);
        expect(res.body.ok).toBe(false);
    });
});
