import type { GitHubRepo } from "@/lib/github";

export type VisibilityFilter = "all" | "public" | "private";
export type ForkFilter = "all" | "fork" | "non-fork";
export type SortOption = "updated_desc" | "name_asc";

export type ProjectQuery = {
    query: string;
    visibility: VisibilityFilter;
    forkFilter: ForkFilter;
    sortBy: SortOption;
};

export function applyProjectsQuery(repos: GitHubRepo[], options: ProjectQuery): GitHubRepo[] {
    const normalizedQuery = options.query.trim().toLowerCase();

    const filtered = repos.filter((repo) => {
        const matchesVisibility =
            options.visibility === "all" ||
            (options.visibility === "public" && !repo.private) ||
            (options.visibility === "private" && repo.private);

        const matchesFork =
            options.forkFilter === "all" ||
            (options.forkFilter === "fork" && repo.fork) ||
            (options.forkFilter === "non-fork" && !repo.fork);

        if (!matchesVisibility || !matchesFork) {
            return false;
        }

        if (!normalizedQuery) {
            return true;
        }

        const haystack = `${repo.name} ${repo.full_name} ${repo.description ?? ""}`.toLowerCase();
        return haystack.includes(normalizedQuery);
    });

    if (options.sortBy === "name_asc") {
        return [...filtered].sort((a, b) => a.full_name.localeCompare(b.full_name, "fr"));
    }

    return [...filtered].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export function paginateProjects(repos: GitHubRepo[], pageSize: number, currentPage: number) {
    const totalPages = Math.max(1, Math.ceil(repos.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
        totalPages,
        safePage,
        startIndex,
        endIndex,
        paginatedRepos: repos.slice(startIndex, endIndex),
    };
}