import { createSlice } from "@reduxjs/toolkit";
import safeStorage from "../../utils/safeStorage";

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
      safeStorage.removeItem("steeltech-fabricator-admin");
    },
  },
});

export const { adminLoggedIn, adminLoggedOut } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
