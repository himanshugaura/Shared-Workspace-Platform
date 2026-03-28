import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth.slice";
import viewProfileReducer from "./features/viewProfile.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    viewProfile: viewProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;