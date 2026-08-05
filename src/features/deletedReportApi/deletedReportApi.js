import { makeEndpoint } from "../../utils/makeEndpoint";
import { useFetchQuery } from "../../hooks/useFetchQuery";
import httpClient from "../api/httpClient";

export const DELETED_REPORT_QUERY_KEY = "deleted-report";

// query: { page, status } — status is one of "pending" | "resolved" | "unresolved" (omit for all)
export const useGetDeletedReports = ({ query }) => {
  const endPoint = makeEndpoint("/administrator/deleted-report", {
    status: query?.status,
    p: query?.page,
  });
  return useFetchQuery([DELETED_REPORT_QUERY_KEY, query], endPoint, {});
};

// payload: { id, status } — status must be "resolved" (hard-deletes the report, irreversible)
// or "unresolved" (rejects the request, report untouched)
export async function resolveDeleteRequest(payload) {
  return httpClient.patch("/administrator/deleted-report/", payload);
}
