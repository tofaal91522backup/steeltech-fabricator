import React from "react";

export default function SimpleTable({
  rows = [],
  columns = [],
  emptyText = "No results found",
  className = "",
  tableClassName = "",
}) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className={`w-full border border-gray-200 text-sm ${tableClassName}`}>
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
  );
}
