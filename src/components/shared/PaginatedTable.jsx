import React from "react";
import AsyncStateWrapper from "./AsyncStateWrapper";
import Pagination from "./Pagination";

export default function PaginatedTable({
  title,
  subtitle,
  data,
  columns,
  loading = false,
  error = "",
  page,
  setPage,
  className = "",
  tableWrapClassName = "",
  showPagination = true,
  emptyText = "No data found",
  rightSlot,
}) {
  const rows = data?.results || [];
  const currentPage = data?.current_page ?? page ?? 1;
  const totalPages = data?.num_pages ?? 1;
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;

  return (
    <AsyncStateWrapper loading={loading} error={error}>
      <div className={`w-full ${className}`}>
        {(title || subtitle || rightSlot) && (
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            {rightSlot ? (
              <div className="flex items-center gap-2">{rightSlot}</div>
            ) : null}
          </div>
        )}

        <div
          className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${tableWrapClassName}`}
        >
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-900 ${col.thClassName || ""}`}
                      style={col.width ? { width: col.width } : undefined}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.length ? (
                  rows.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="border-b border-gray-100 last:border-b-0 odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-4 py-3 text-gray-800 ${col.tdClassName || ""}`}
                        >
                          {col.render
                            ? col.render(row, idx)
                            : String(row?.[col.key] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      {emptyText}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {showPagination && (
            <Pagination
              page={page}
              setPage={setPage}
              currentPage={currentPage}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrev={hasPrev}
            />
          )}
        </div>
      </div>
    </AsyncStateWrapper>
  );
}
