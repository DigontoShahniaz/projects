import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: null, isError: false },
  reducers: {
    setNotification(state, action) {
      return {
        message: action.payload.message,
        isError: action.payload.isError,
      };
    },
    clearNotification() {
      return { message: null, isError: false };
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const displayNotification = (
  message,
  isError = false,
  timeout = 5000,
) => {
  return (dispatch) => {
    dispatch(setNotification({ message, isError }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, timeout);
  };
};

export default notificationSlice.reducer;
