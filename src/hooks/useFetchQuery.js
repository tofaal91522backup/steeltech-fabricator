import { useQuery } from "@tanstack/react-query";
import httpClient from "../features/api/httpClient";

export function useFetchQuery(key, url, options = {}) {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await httpClient.get(url);
      return response;
    },
    ...options,
  });
}
