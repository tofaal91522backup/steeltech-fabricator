import React from "react";

export default function SimplePagination({
  page,
  setPage,
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  className = "",
}) {
  const cp = currentPage ?? page ?? 1;
  const tp = totalPages ?? 1;

  return (
    <div
      className={` flex items-center justify-center gap-3 r bg-white py-2 ${className}`}
    >
      <button
        type="button"
        disabled={!hasPrev || cp <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        ← Previous
      </button>

      <div className="text-sm text-gray-600">
        Page <span className="font-semibold text-gray-900">{cp}</span> of{" "}
        <span className="font-semibold text-gray-900">{tp}</span>
      </div>

      <button
        type="button"
        disabled={!hasNext}
        onClick={() => setPage((p) => p + 1)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
}
