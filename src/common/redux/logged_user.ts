/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

export type UserHookData = {
  id: string;
  email: string;
  familyName: string;
  givenName: string;
  accessToken: string;
  refreshToken: string;
};

export type LoggedUserState = {
  user: UserHookData | null;
};
const slice = createSlice({
  name: "loggedUser",
  initialState: { user: null },
  reducers: {
    registerUser: (state: LoggedUserState, action) => {
      state.user = action.payload;
    },
  },
});

export const { registerUser } = slice.actions;
export default slice.reducer;
