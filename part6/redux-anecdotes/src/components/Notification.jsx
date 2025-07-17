import { useSelector } from "react-redux";

const Notification = () => {
  const notificationState = useSelector((state) => state.notification);
  console.log("notification state:", notificationState);

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };
  return (
    <>
      {notificationState.isActive ? (
        <div style={style}>{notificationState.notification}</div>
      ) : (
        ""
      )}
    </>
  );
};

export default Notification;
