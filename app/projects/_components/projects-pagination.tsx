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
        <>
            <div style={{ marginTop: "0.85rem", fontSize: "0.9rem", color: "#555" }}>
                Page {currentPage} / {totalPages} - Affichage {startIndex + 1} a {Math.min(endIndex, totalItems)}
            </div>

            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.25rem" }}>
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={currentPage === 1}
                    style={{
                        padding: "0.5rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        background: currentPage === 1 ? "#f5f5f5" : "white",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                >
                    Precedent
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    style={{
                        padding: "0.5rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        background: currentPage === totalPages ? "#f5f5f5" : "white",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                >
                    Suivant
                </button>
            </div>
        </>
    );
}