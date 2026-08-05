import { useMemo, useState } from "react";

import { useGetActivityLogs } from "../../features/activityLogApi/activityLogApi";
import SimpleTable from "../../components/shared/SimpleTable";
import SimplePagination from "../../components/shared/SimplePagination";
import AsyncStateWrapper from "../../components/shared/AsyncStateWrapper";

export default function ActivityLogs() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetActivityLogs({
    query: { page },
  });

  const rows = data?.results || [];

  const columns = useMemo(
    () => [
      { key: "admin_name", header: "Admin Name" },
      { key: "admin_email", header: "Email" },
      { key: "activity_description", header: "Activity" },
      {
        key: "timestamp",
        header: "Time",
        render: (row) => new Date(row.timestamp).toLocaleString(),
      },
    ],
    [],
  );

  return (
    <AsyncStateWrapper loading={isLoading} error={error?.message}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow p-4">
          <div className=" mb-4">
            <h1 className="text-2xl font-bold">Activity Logs</h1>
            <p className="text-sm text-gray-600">
              View the logs of admin activities
            </p>
          </div>
          <SimpleTable rows={rows} columns={columns} />

          <SimplePagination
            page={page}
            setPage={setPage}
            currentPage={data?.current_page}
            totalPages={data?.num_pages}
            hasNext={!!data?.next}
            hasPrev={!!data?.previous}
          />
        </div>
      </div>
    </AsyncStateWrapper>
  );
}
