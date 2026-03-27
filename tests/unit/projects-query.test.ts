// Exemple de test unitaire pour la fonction de tri des projets
import { applyProjectsQuery } from "../../app/projects/_utils/projects-query";

describe("applyProjectsQuery", () => {
  it("filtre par nom de projet", () => {
    const repos = [
      { name: "alpha", private: false, fork: false, updated_at: "", id: 1, html_url: "", description: null },
      { name: "beta", private: false, fork: false, updated_at: "", id: 2, html_url: "", description: null },
    ];
    const result = applyProjectsQuery(repos as any, { query: "alpha", visibility: "all", forkFilter: "all", sortBy: "updated_desc" });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("alpha");
  });
});
