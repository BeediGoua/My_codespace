import request from "supertest";

describe("POST /api/codespaces/create", () => {
    it("doit refuser sans owner/repo", async () => {
        const res = await request("http://localhost:3000")
            .post("/api/codespaces/create")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.ok).toBe(false);
    });
    it("doit créer un codespace (mock)", async () => {
        const res = await request("http://localhost:3000")
            .post("/api/codespaces/create")
            .send({ owner: "test-user", repo: "test-repo", display_name: "Test Codespace" });
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data).toHaveProperty("display_name");
    });
    // Pour tester la création réelle, il faudra mocker l'authentification et utiliser un vrai token GitHub
});
