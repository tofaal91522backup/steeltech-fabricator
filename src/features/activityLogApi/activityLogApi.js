import { useFetchQuery } from "../../hooks/useFetchQuery";
import { makeEndpoint } from "../../utils/makeEndpoint";
export const ACTIVITY_LOG_QUERY_KEY = "activity-log";

export const useGetActivityLogs = ({ query }) => {
  const endPoint = makeEndpoint("/administrator/admin-management", {
    view: "activities",
    p: query.page,
  });
  return useFetchQuery([ACTIVITY_LOG_QUERY_KEY, query], endPoint, {});
};
