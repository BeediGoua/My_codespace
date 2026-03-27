// components/codespaces/CodespacePanel.tsx

"use client";

import { useMemo, useState } from "react";

type UiStatus =
  | "idle"
  | "checking"
  | "creating"
  | "waiting"
  | "ready"
  | "error";

type Codespace = {
  id: string;
  display_name?: string;
  name: string;
  state?: string;
  web_url?: string;
};

type RepoCodespacesResponse = {
  total_count?: number;
  codespaces: Codespace[];
};

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  code?: number;
};

type Props = {
  owner: string;
  repo: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeState(state?: string): string {
  if (!state) return "Unknown";
  const s = state.toLowerCase();

  if (s.includes("available")) return "Available";
  if (s.includes("creating")) return "Creating";
  if (s.includes("queued")) return "Queued";
  if (s.includes("starting")) return "Starting";
  if (s.includes("shutdown")) return "Shutdown";
  if (s.includes("stopped")) return "Shutdown";
  if (s.includes("failed")) return "Failed";

  return state;
}

export default function CodespacePanel({ owner, repo }: Props) {
  const [status, setStatus] = useState<UiStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [codespace, setCodespace] = useState<Codespace | null>(null);

  const repoLabel = useMemo(() => `${owner}/${repo}`, [owner, repo]);

  async function getExistingCodespace(): Promise<Codespace | null> {
    const res = await fetch(
      `/api/codespaces?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
      { method: "GET" }
    );

    const json: ApiResponse<RepoCodespacesResponse> = await res.json();

    if (!res.ok || !json.ok) {
      throw new Error(json.error || "Impossible de lister les Codespaces");
    }

    const list = json.data?.codespaces ?? [];
    if (list.length === 0) return null;

    const reusable =
      list.find((c) => {
        const state = normalizeState(c.state);
        return (
          state === "Available" ||
          state === "Starting" ||
          state === "Creating"
        );
      }) ?? list[0];

    return reusable;
  }

  async function createCodespace(): Promise<Codespace> {
    const res = await fetch("/api/codespaces/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ owner, repo }),
    });

    const json: ApiResponse<Codespace> = await res.json();

    if (!res.ok || !json.ok || !json.data) {
      throw new Error(json.error || "Impossible de créer le Codespace");
    }

    return json.data;
  }

  async function pollCodespace(name: string): Promise<Codespace> {
    const maxAttempts = 40;
    const delayMs = 3000;

    for (let i = 0; i < maxAttempts; i++) {
      const res = await fetch(`/api/codespaces/${encodeURIComponent(name)}`, {
        method: "GET",
      });

      const json: ApiResponse<Codespace> = await res.json();

      if (!res.ok || !json.ok || !json.data) {
        throw new Error(json.error || "Impossible de lire l'état du Codespace");
      }

      const current = json.data;
      const state = normalizeState(current.state);

      setCodespace(current);

      if (state === "Available") {
        return current;
      }

      if (state === "Failed") {
        throw new Error("La création du Codespace a échoué");
      }

      await sleep(delayMs);
    }

    throw new Error("Timeout pendant la préparation du Codespace");
  }

  async function handleOpenCodespace() {
    try {
      setError(null);
      setStatus("checking");

      const existing = await getExistingCodespace();

      if (existing) {
        setCodespace(existing);

        const state = normalizeState(existing.state);

        if (state === "Available") {
          setStatus("ready");
          return;
        }

        setStatus("waiting");
        const ready = await pollCodespace(existing.name);
        setCodespace(ready);
        setStatus("ready");
        return;
      }

      setStatus("creating");
      const created = await createCodespace();
      setCodespace(created);

      setStatus("waiting");
      const ready = await pollCodespace(created.name);
      setCodespace(ready);
      setStatus("ready");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur inattendue";
      setError(message);
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Codespace</h2>
        <p className="text-sm text-gray-600">{repoLabel}</p>
      </div>

      <div className="text-sm">
        <span className="font-medium">Statut :</span>{" "}
        {status === "idle" && "Prêt"}
        {status === "checking" && "Vérification d’un Codespace existant..."}
        {status === "creating" && "Création du Codespace..."}
        {status === "waiting" && "Préparation de l’environnement..."}
        {status === "ready" && "Codespace prêt"}
        {status === "error" && "Erreur"}
      </div>

      {codespace && (
        <div className="rounded-lg bg-gray-50 p-3 text-sm space-y-1">
          <div>
            <span className="font-medium">Nom :</span> {codespace.name}
          </div>
          <div>
            <span className="font-medium">Display name :</span>{" "}
            {codespace.display_name || "—"}
          </div>
          <div>
            <span className="font-medium">État GitHub :</span>{" "}
            {codespace.state || "—"}
          </div>
          <div>
            <span className="font-medium">URL :</span>{" "}
            {codespace.web_url ? (
              <a
                href={codespace.web_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Ouvrir le Codespace
              </a>
            ) : (
              "—"
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleOpenCodespace}
          disabled={
            status === "checking" ||
            status === "creating" ||
            status === "waiting"
          }
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {status === "idle" && "Créer ou ouvrir"}
          {status === "checking" && "Vérification..."}
          {status === "creating" && "Création..."}
          {status === "waiting" && "Préparation..."}
          {status === "ready" && "Vérifier / rouvrir"}
          {status === "error" && "Réessayer"}
        </button>

        {codespace?.web_url && status === "ready" && (
          <a
            href={codespace.web_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border px-4 py-2"
          >
            Ouvrir
          </a>
        )}
      </div>
    </div>
  );
}