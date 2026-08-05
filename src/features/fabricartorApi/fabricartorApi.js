import { apiSlice } from "../api/apiSlice";

export const fabricatorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerFabricator: builder.mutation({
      query: (data) => ({
        url: `/fabricator/fabricator/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["fabricator"],
    }),
    getAllMRForReg: builder.query({
      query: () => `/fabricator/fabricator/?view=marketing-rep`,
      providesTags: ["fabricator"],
    }),
    getAllDistributorForReg: builder.query({
      query: () => `/fabricator/fabricator/?view=distributor`,
      providesTags: ["fabricator"],
    }),

    getAllFabricators: builder.query({
      query: ({ page, view, searchTerm }) =>
        `/administrator/fabricator/?p=${page}&view=${view}&search=${searchTerm}`,
      providesTags: ["fabricator"],
    }),
    getFabricatorById: builder.query({
      query: ({ id }) => `/administrator/fabricator/?id=${id}`,
      providesTags: ["fabricator"],
    }),
    getAllMR: builder.query({
      query: () => `fabricator/fabricator/?view=marketing-rep`,
      providesTags: ["fabricator"],
    }),

    assignMr: builder.mutation({
      query: ({ data }) => ({
        url: `/administrator/fabricator/?action=assign`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["fabricator"],
    }),
    changeStatus: builder.mutation({
      query: ({ data }) => ({
        url: `/administrator/fabricator/?action=status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["fabricator"],
    }),

    // deleteMarketingRep: builder.mutation({
    //   query: ({ id }) => ({
    //     url: `/administrator/marketing-representative/?id=${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["markRep"],
    // }),
  }),
});

export const {
  useRegisterFabricatorMutation,
  useGetAllMRForRegQuery,
  useGetAllDistributorForRegQuery,
  useGetAllFabricatorsQuery,
  useGetFabricatorByIdQuery,
  useGetAllMRQuery,
  useAssignMrMutation,
  useChangeStatusMutation,
} = fabricatorApi;
