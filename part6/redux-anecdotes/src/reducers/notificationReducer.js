import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { notification: "", isActive: false },
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    displayNotification(state, action) {
      return action.payload;
    },
  },
});

export const { setNotification, displayNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

let timeoutId;

export const setNotificationWithTimeout = (message, time) => {
  return (dispatch) => {
    // Limpiar timeout anterior si existe
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    dispatch(setNotification({ notification: message, isActive: true }));

    timeoutId = setTimeout(() => {
      dispatch(setNotification({ notification: "", isActive: false }));
      timeoutId = null; // limpiar referencia
    }, time * 1000);
  };
};
