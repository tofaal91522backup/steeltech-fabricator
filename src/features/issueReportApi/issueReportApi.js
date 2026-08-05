import { makeEndpoint } from "../../utils/makeEndpoint";
import { useFetchQuery } from "../../hooks/useFetchQuery";
import httpClient from "../api/httpClient";

export const ISSUE_REPORT_QUERY_KEY = "issue-report";

// query: { page, status } — status is one of "open" | "in_progress" | "closed" (omit for all)
export const useGetIssueReports = ({ query }) => {
  const endPoint = makeEndpoint("/administrator/issue-report", {
    status: query?.status,
    p: query?.page,
  });
  return useFetchQuery([ISSUE_REPORT_QUERY_KEY, query], endPoint, {});
};

// payload: { id, status?, reply? } — status and reply are each optional/independent
export async function replyToIssueReport(payload) {
  return httpClient.patch("/administrator/issue-report/", payload);
}
