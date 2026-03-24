export default function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Connexion GitHub</h1>
      <p>Premiere etape : se connecter a GitHub depuis notre interface.</p>

      <a
        href="/api/auth/github/login"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "0.8rem 1.2rem",
          background: "black",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        Se connecter avec GitHub
      </a>
    </main>
  );
}
