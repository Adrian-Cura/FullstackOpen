export const notifyWithTimeout = (dispatch, message, timeout = 5000) => {
  dispatch({ type: "SET_NOTIFICATION", payload: message });

  setTimeout(() => {
    dispatch({ type: "CLEAR_NOTIFICATION" });
  }, timeout);
};
