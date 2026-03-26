"use client";

import { useMemo, useState } from "react";
import type { GitHubRepo } from "@/lib/github";
import ProjectsFilters from "./_components/projects-filters";
import ProjectsItems from "./_components/projects-items";
import ProjectsPagination from "./_components/projects-pagination";
import {
    applyProjectsQuery,
    paginateProjects,
    type ForkFilter,
    type SortOption,
    type VisibilityFilter,
} from "./_utils/projects-query";

type ProjectsListProps = {
    repos: GitHubRepo[];
};

export default function ProjectsList({ repos }: ProjectsListProps) {
    const [query, setQuery] = useState("");
    const [visibility, setVisibility] = useState<VisibilityFilter>("all");
    const [forkFilter, setForkFilter] = useState<ForkFilter>("all");
    const [sortBy, setSortBy] = useState<SortOption>("updated_desc");
    const [pageSize, setPageSize] = useState<10 | 20 | 30>(10);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredAndSortedRepos = useMemo(() => {
        return applyProjectsQuery(repos, {
            query,
            visibility,
            forkFilter,
            sortBy,
        });
    }, [repos, query, visibility, forkFilter, sortBy]);

    const { totalPages, safePage, startIndex, endIndex, paginatedRepos } = useMemo(
        () => paginateProjects(filteredAndSortedRepos, pageSize, currentPage),
        [filteredAndSortedRepos, pageSize, currentPage]
    );

    return (
        <section style={{ marginTop: "1rem" }}>
            <ProjectsFilters
                query={query}
                visibility={visibility}
                forkFilter={forkFilter}
                sortBy={sortBy}
                pageSize={pageSize}
                resultsCount={filteredAndSortedRepos.length}
                onQueryChange={(value) => {
                    setQuery(value);
                    setCurrentPage(1);
                }}
                onVisibilityChange={(value) => {
                    setVisibility(value);
                    setCurrentPage(1);
                }}
                onForkFilterChange={(value) => {
                    setForkFilter(value);
                    setCurrentPage(1);
                }}
                onSortChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1);
                }}
                onPageSizeChange={(value) => {
                    setPageSize(value);
                    setCurrentPage(1);
                }}
            />

            {filteredAndSortedRepos.length === 0 ? (
                <p style={{ marginTop: "1rem" }}>Aucun projet ne correspond aux filtres.</p>
            ) : (
                <>
                    <ProjectsPagination
                        currentPage={safePage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        totalItems={filteredAndSortedRepos.length}
                        onPrev={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    />

                    <ProjectsItems repos={paginatedRepos} />
                </>
            )}
        </section>
    );
}