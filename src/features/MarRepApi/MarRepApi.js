import { apiSlice } from "../api/apiSlice";

export const MarRepApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMarketingRep: builder.mutation({
      query: (data) => ({
        url: `/administrator/marketing-representative/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["markRep"],
    }),

    getMarketingRep: builder.query({
      query: ({ page, searchTerm }) =>
        `/administrator/marketing-representative/?p=${page}&search=${searchTerm}`,
      providesTags: ["markRep"],
    }),
    getMarketingRepById: builder.query({
      query: ({ id }) => `/administrator/marketing-representative/?id=${id}`,
      providesTags: ["markRep"],
    }),

    // View Mar Fab
    viewMarketingFabricator: builder.query({
      query: ({ id, page }) =>
        `/administrator/marketing-representative/?id=${id}&view=assigned-fabricators&p=${page}`,
      providesTags: ["markRep"],
    }),
    // View Mar Dis
    viewAssignedDistributor: builder.query({
      query: ({ id, page }) =>
        `/administrator/marketing-representative/?id=${id}&view=assigned-distributors&p=${page}`,
      providesTags: ["markRep"],
    }),
    viewAllFabricatorList: builder.query({
      query: () =>
        `/administrator/marketing-representative/?view=all-fabricator-list`,
      providesTags: ["markRep"],
    }),
    // Add dis to MR
    addDistributorToMR: builder.mutation({
      query: ({ id, data }) => ({
        url: `/administrator/marketing-representative/?action=assign-distributor&id=${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["markRep"],
    }),
    // Add dis to MR
    addFabricatorToMR: builder.mutation({
      query: ({ id, data }) => ({
        url: `/administrator/marketing-representative/?action=assign-fabricator&id=${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["markRep"],
    }),

    updateMarketingRep: builder.mutation({
      query: ({ id, data }) => ({
        url: `/administrator/marketing-representative/?id=${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["markRep"],
    }),

    deleteMarketingRep: builder.mutation({
      query: ({ id }) => ({
        url: `/administrator/marketing-representative/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["markRep"],
    }),
    createMarketingRepTask: builder.mutation({
      query: (data) => ({
        url: `/administrator/marketing-representative/?action=assign`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["markRep"],
    }),
    viewTask: builder.query({
      query: ({ id }) =>
        `/administrator/marketing-representative/?id=${id}&view=tasks`,
      providesTags: ["markRep"],
    }),
    deleteFabFromMR: builder.mutation({
      query: ({ repId, fabId }) => ({
        url: `/administrator/marketing-representative/?id=${repId}&action=remove-fabricator&fabricator_id=${fabId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["markRep"],
    }),
    deleteDisFromMR: builder.mutation({
      query: ({ repId, disId }) => ({
        url: `/administrator/marketing-representative/?id=${repId}&action=remove-distributor&distributor_id=${disId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["markRep"],
    }),
  }),
});

export const {
  useCreateMarketingRepMutation,
  useGetMarketingRepQuery,
  useGetMarketingRepByIdQuery,
  useViewMarketingFabricatorQuery,
  useViewAssignedDistributorQuery,
  useViewAllFabricatorListQuery,
  useAddDistributorToMRMutation,
  useAddFabricatorToMRMutation,
  useUpdateMarketingRepMutation,
  useDeleteMarketingRepMutation,
  useCreateMarketingRepTaskMutation,
  useViewTaskQuery,
  useDeleteFabFromMRMutation,
  useDeleteDisFromMRMutation,
} = MarRepApi;
