// lib/github/codespaces.ts

import { githubGet, githubPost } from "./client";

export type Codespace = {
  id: string;
  display_name?: string;
  name: string;
  state: string;
  web_url?: string;
  repository?: {
    id?: number;
    name?: string;
    full_name?: string;
    owner?: {
      login?: string;
    };
  };
  machine?: {
    name?: string;
    display_name?: string;
  };
  idle_timeout_minutes?: number;
  created_at?: string;
  updated_at?: string;
  last_used_at?: string;
};

export type CodespacesListResponse = {
  total_count?: number;
  codespaces: Codespace[];
};

export async function fetchRepoCodespaces(
  accessToken: string,
  owner: string,
  repo: string
): Promise<CodespacesListResponse> {
  return await githubGet<CodespacesListResponse>({
    accessToken,
    path: `/repos/${owner}/${repo}/codespaces`,
  });
}

// Crée un Codespace via l'API GitHub
export async function createRepoCodespace(
  accessToken: string,
  repositoryId: number,
  params: {
    location?: string;
    machine_type?: string;
    devcontainer_path?: string;
    idle_timeout_minutes?: number;
    display_name?: string;
    retention_period_minutes?: number;
    ref?: string;
  } = {}
): Promise<Codespace> {
  return await githubPost<Codespace>({
    accessToken,
    path: `/user/codespaces`,
    body: {
      repository_id: repositoryId,
      ...params,
    },
  });
}

// Récupère un Codespace précis pour l'utilisateur authentifié
export async function getCodespaceByName(
  accessToken: string,
  name: string
): Promise<Codespace> {
  return await githubGet<Codespace>({
    accessToken,
    path: `/user/codespaces/${name}`,
  });
}

/**
 * Arrête un Codespace
 */
export async function stopCodespace(
  accessToken: string,
  name: string
): Promise<Codespace> {
  return await githubPost<Codespace>({
    accessToken,
    path: `/user/codespaces/${name}/stop`,
    body: {},
  });
}

/**
 * Démarre un Codespace
 */
export async function startCodespace(
  accessToken: string,
  name: string
): Promise<Codespace> {
  return await githubPost<Codespace>({
    accessToken,
    path: `/user/codespaces/${name}/start`,
    body: {},
  });
}

/**
 * Supprime un Codespace
 */
export async function deleteRepoCodespace(
  accessToken: string,
  name: string
): Promise<void> {
  await fetch(`https://api.github.com/user/codespaces/${name}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
}