import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signin: (state) => {
      state.status = true;
    },
    signout: (state) => {
      state.status = false;
    },
  },
});

export const { signin, signout } = authSlice.actions;
export default authSlice.reducer;
