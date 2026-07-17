import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    // Reducers will go here
  },
});

export default store;
