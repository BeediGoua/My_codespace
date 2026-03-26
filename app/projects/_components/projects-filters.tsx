import type { ForkFilter, SortOption, VisibilityFilter } from "../_utils/projects-query";

type ProjectsFiltersProps = {
    query: string;
    visibility: VisibilityFilter;
    forkFilter: ForkFilter;
    sortBy: SortOption;
    pageSize: 10 | 20 | 30;
    resultsCount: number;
    onQueryChange: (value: string) => void;
    onVisibilityChange: (value: VisibilityFilter) => void;
    onForkFilterChange: (value: ForkFilter) => void;
    onSortChange: (value: SortOption) => void;
    onPageSizeChange: (value: 10 | 20 | 30) => void;
};

export default function ProjectsFilters({
    query,
    visibility,
    forkFilter,
    sortBy,
    pageSize,
    resultsCount,
    onQueryChange,
    onVisibilityChange,
    onForkFilterChange,
    onSortChange,
    onPageSizeChange,
}: ProjectsFiltersProps) {
    return (
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <input
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Rechercher un projet..."
                style={{
                    minWidth: "240px",
                    padding: "0.65rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                }}
            />

            <select
                value={visibility}
                onChange={(event) => onVisibilityChange(event.target.value as VisibilityFilter)}
                style={{
                    padding: "0.65rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "white",
                }}
            >
                <option value="all">Tous</option>
                <option value="public">Publics</option>
                <option value="private">Prives</option>
            </select>

            <select
                value={forkFilter}
                onChange={(event) => onForkFilterChange(event.target.value as ForkFilter)}
                style={{
                    padding: "0.65rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "white",
                }}
            >
                <option value="all">Tous (forks inclus)</option>
                <option value="fork">Forks uniquement</option>
                <option value="non-fork">Sans forks</option>
            </select>

            <select
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value as SortOption)}
                style={{
                    padding: "0.65rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "white",
                }}
            >
                <option value="updated_desc">Tri: MAJ recente</option>
                <option value="name_asc">Tri: Nom A-Z</option>
            </select>

            <select
                value={String(pageSize)}
                onChange={(event) => onPageSizeChange(Number(event.target.value) as 10 | 20 | 30)}
                style={{
                    padding: "0.65rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "white",
                }}
            >
                <option value="10">10 / page</option>
                <option value="20">20 / page</option>
                <option value="30">30 / page</option>
            </select>

            <span style={{ fontSize: "0.92rem", color: "#444" }}>{resultsCount} resultat(s)</span>
        </div>
    );
}