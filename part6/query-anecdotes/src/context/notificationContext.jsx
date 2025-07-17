/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const notifyWithTimeout = (dispatch, message, timeout = 5000) => {
  dispatch({ type: "SET_NOTIFICATION", payload: message });

  setTimeout(() => {
    dispatch({ type: "CLEAR_NOTIFICATION" });
  }, timeout);
};

export default NotificationContext;
