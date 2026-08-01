import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://hos-api.ongshak.com`,
    prepareHeaders: (headers, { getState }) => {
      let adminToken = getState()?.authAdmin?.token;


      if (adminToken) {
        headers.set("Authorization", `Bearer ${adminToken}`);
      }
      headers.set("Content-Type", `application/json`);
      headers.set("Accept", `application/json`);
      return headers;
    },
  }),
  tagTypes: ["distributor", "markRep", "fabricator", "reports", "district"],
  endpoints: () => ({}),
});
