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
        <div className="toolbar-card">
            <h2 className="section-title">Filtrer et trouver vite</h2>
            <p className="toolbar-note">
                Recherche un projet, limite le bruit visuel et repere rapidement ce qui doit etre ouvert ou repris.
            </p>

            <div className="toolbar-grid" style={{ marginTop: "16px" }}>
                <input
                    type="search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Rechercher un projet..."
                    className="toolbar-input"
                />

                <select
                    value={visibility}
                    onChange={(event) => onVisibilityChange(event.target.value as VisibilityFilter)}
                    className="toolbar-select"
                >
                    <option value="all">Tous</option>
                    <option value="public">Publics</option>
                    <option value="private">Prives</option>
                </select>

                <select
                    value={forkFilter}
                    onChange={(event) => onForkFilterChange(event.target.value as ForkFilter)}
                    className="toolbar-select"
                >
                    <option value="all">Tous (forks inclus)</option>
                    <option value="fork">Forks uniquement</option>
                    <option value="non-fork">Sans forks</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(event) => onSortChange(event.target.value as SortOption)}
                    className="toolbar-select"
                >
                    <option value="updated_desc">Tri: MAJ recente</option>
                    <option value="name_asc">Tri: Nom A-Z</option>
                </select>

                <select
                    value={String(pageSize)}
                    onChange={(event) => onPageSizeChange(Number(event.target.value) as 10 | 20 | 30)}
                    className="toolbar-select"
                >
                    <option value="10">10 / page</option>
                    <option value="20">20 / page</option>
                    <option value="30">30 / page</option>
                </select>
            </div>

            <div className="toolbar-footer">
                <span className="results-chip">{resultsCount} resultat(s)</span>
                <span className="toolbar-note">Vue orientee selection rapide avant ouverture ou reprise.</span>
            </div>
        </div>
    );
}