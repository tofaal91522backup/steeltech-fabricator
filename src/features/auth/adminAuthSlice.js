import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: undefined,
  refresh: undefined,
  user: undefined,
};

const adminAuthSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    adminLoggedIn: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    adminLoggedOut: (state) => {
      state.token = undefined;
      state.user = undefined;
      localStorage.removeItem("steeltech-fabricator-admin");
      // localStorage.removeItem("transend-auth-admininde");
    },
  },
});

export const { adminLoggedIn, adminLoggedOut } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
