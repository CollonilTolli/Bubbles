import css from "./Pagination.module.scss";

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const MAX_BUTTONS = 5;
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + MAX_BUTTONS - 2);

  const renderPaginationButtons = () => {
    const buttons = [];

    // Кнопка "Назад"
    buttons.push(
      <div key="prev" className={css.PrevButton}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage < 2}
        >
          <svg
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="ArrowBackIcon"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path>
          </svg>
        </button>
      </div>
    );
    if (startPage > 2) {
      buttons.push(
        <div key="first" className={css.PageButton}>
          <button onClick={() => setCurrentPage(1)}>1</button>
          <span>...</span>
        </div>
      );
    }
    // Кнопки с номерами страниц
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <div key={i} className={css.PageButton}>
          <button
            onClick={() => setCurrentPage(i)}
            className={currentPage === i ? css.CurrentPage : ""}
          >
            {i}
          </button>
        </div>
      );
    }
    if (endPage < totalPages - 1) {
      buttons.push(
        <div key="last" className={css.PageButton}>
          <span>...</span>
          <button onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </button>
        </div>
      );
    }
    // Кнопка "Вперед"
    buttons.push(
      <div key="next" className={css.NextButton}>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <svg
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="ArrowForwardIcon"
          >
            <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
          </svg>
        </button>
      </div>
    );

    return buttons;
  };

  return (
    <div className={css.PaginationWrapper}>{renderPaginationButtons()}</div>
  );
}
