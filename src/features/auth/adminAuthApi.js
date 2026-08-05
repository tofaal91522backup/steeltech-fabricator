import { apiSlice } from "../api/apiSlice";
import { adminLoggedIn } from "./adminAuthSlice";
import safeStorage from "../../utils/safeStorage";

export const adminAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: "/rest-auth/login/",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
         
          safeStorage.removeItem("steeltech-fabricator-admin");

          safeStorage.setItem(
            "steeltech-fabricator-admin",
            JSON.stringify({
              token: result?.data?.access,
              user: result?.data?.user,
            })
          );

          dispatch(
            adminLoggedIn({
              token: result?.data?.access,
              user: result?.data?.user,
            })
            // adminLoggedOut()
          );
        } catch (err) {
          // do nothing
          console.log("err", err);
        }
      },
    }),
  }),
});

export const { useAdminLoginMutation } = adminAuthApi;
