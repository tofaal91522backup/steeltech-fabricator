import { apiSlice } from "../api/apiSlice";

export const distributorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDistributor: builder.mutation({
      query: (data) => ({
        url: `/administrator/distributor/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["distributor"],
    }),

    getDistributors: builder.query({
      query: ({ page, searchTerm }) =>
        `/administrator/distributor?p=${page}&search=${searchTerm}`,
      providesTags: ["distributor"],
    }),
    getDistributorById: builder.query({
      query: ({ id }) => `/administrator/distributor/?id=${id}`,
      providesTags: ["distributor"],
    }),

    updateDistributor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/administrator/distributor/?id=${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["distributor"],
    }),
    editDistributor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/administrator/distributor/?id=${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["distributor"],
    }),

    deleteDistributor: builder.mutation({
      query: ({ id }) => ({
        url: `/administrator/distributor/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["distributor"],
    }),
  }),
});

export const {
  useCreateDistributorMutation,
  useGetDistributorsQuery,
  useGetDistributorByIdQuery,
  useUpdateDistributorMutation,
  useEditDistributorMutation,
  useDeleteDistributorMutation,
} = distributorApi;
