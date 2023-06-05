import { Button } from "components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getNotificationTemplates, getAllNotifications } from "store";
import { NotificationTemplates, Notifications } from "./sections";

export const ClientNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getNotificationTemplates());
      await dispatch(getAllNotifications());
    })();
  }, []);

  const [defaultView, setDefaultView] = useState("notificationTemplates");
  return (
    <div className="p-[40px]">
      <div className="mb-[20px]">
        <Button
          type="ghost"
          htmlType="button"
          onClick={() => {
            if (defaultView === "notifications") {
              setDefaultView("notificationTemplates");
            } else if (defaultView === "notificationTemplates") {
              setDefaultView("notifications");
            }
          }}
        >
          {defaultView === "notifications"
            ? "Show Notification Templates"
            : "Show Notifications"}
        </Button>
      </div>
      {defaultView === "notificationTemplates" ? (
        <NotificationTemplates />
      ) : (
        <></>
      )}
      {defaultView === "notifications" ? <Notifications /> : <></>}
    </div>
  );
};
