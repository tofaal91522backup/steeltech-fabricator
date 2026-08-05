import { apiSlice } from "../api/apiSlice";

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    viewDashboard: builder.query({
      query: () => `administrator/dashboard/`,
      providesTags: ["reports"],
    }),
    getReports: builder.query({
      query: ({ page, fromDate, toDate, view, mr_id, search }) =>
        `/administrator/report/?p=${page}&from_date=${fromDate}&to_date=${toDate}&view=${view}${
          search ? `&search=${search}` : ""
        }${mr_id ? `&marketing-rep-id=${mr_id}` : ""}`,
      providesTags: ["reports"],
    }),
    getMissingReports: builder.query({
      query: ({ page, month, year, mr_id }) =>
        `administrator/report/?p=${page}&month=${month}&year=${year}&view=missing-report${
          mr_id ? `&marketing-rep-id=${mr_id}` : ""
        }`,
      // `/administrator/report/?p=${page}&from_date=${fromDate}&to_date=${toDate}&view=${view}${
      //   search ? `&search=${search}` : ""
      // }${mr_id ? `&marketing-rep-id=${mr_id}` : ""}`,
      providesTags: ["reports"],
    }),
    getReportById: builder.query({
      query: ({ id }) => `/administrator/report/?id=${id}`,
      providesTags: ["reports"],
    }),
    getMrReportById: builder.query({
      query: ({ id }) =>
        `/administrator/report/?view=marketing-rep-and-fabricator&id=${id}`,
      providesTags: ["reports"],
    }),
    getMissingReportById: builder.query({
      query: ({  id }) =>
        `/administrator/report/?view=missing-report&id=${id}`,
      providesTags: ["reports"],
    }),

    generateExcel: builder.mutation({
      query: ({ fromDate, toDate, view }) => ({
        url: `/administrator/report/?from_date=${fromDate}&to_date=${toDate}&action=csv&view=${view}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["reports"],
    }),
     deleteReport: builder.mutation({
      query: ({ id }) => ({
        url: `/administrator/report/?report-id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reports"],
    }),
    
  }),
});

export const {
  useViewDashboardQuery,
  useGetReportsQuery,
  useGetMissingReportsQuery,
  useGetReportByIdQuery,
  useGetMrReportByIdQuery,
  useGetMissingReportByIdQuery,
  useGenerateExcelMutation,
  useDeleteReportMutation
} = reportsApi;
