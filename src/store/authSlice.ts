import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// User Type
export interface User {
  _id: string;
  username: string;
  email: string;
}

// Auth State
export interface AuthState {
  status: boolean;
  userData: { user: User; expires: string } | null;
}

const initialState: AuthState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; expires: string }>) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;