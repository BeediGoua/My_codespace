type ProjectsPaginationProps = {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    totalItems: number;
    onPrev: () => void;
    onNext: () => void;
};

export default function ProjectsPagination({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    onPrev,
    onNext,
}: ProjectsPaginationProps) {
    return (
        <div className="pagination-shell">
            <div className="pagination-info">
                Page {currentPage} / {totalPages} - Affichage {startIndex + 1} a {Math.min(endIndex, totalItems)}
            </div>

            <div className="pagination-actions">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Precedent
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}