// Exemple de test unitaire pour un helper de formatage de date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

describe("formatDate", () => {
  it("formate une date ISO en date locale", () => {
    expect(formatDate("2024-03-27T12:00:00Z")).toMatch(/2024/);
  });
});
