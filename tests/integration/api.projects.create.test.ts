import request from "supertest";

describe("POST /api/projects/create", () => {
  it("doit refuser la création sans nom de repo", async () => {
    const res = await request("http://localhost:3000")
      .post("/api/projects/create")
      .send({ name: "" });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
  // Ajouter un test avec authentification et données valides pour tester la création réelle
});
