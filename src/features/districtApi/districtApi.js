import { apiSlice } from "../api/apiSlice";

export const districtApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDistrict: builder.query({
      query: () => `/districts/?view=districts`,
      providesTags: ["district"],
    }),
    getUpazilas: builder.query({
      query: ({ id }) => `/districts/?view=thanas&district-id=${id}`,
      providesTags: ["district"],
    }),
  }),
});

export const { useGetDistrictQuery, useGetUpazilasQuery } = districtApi;
