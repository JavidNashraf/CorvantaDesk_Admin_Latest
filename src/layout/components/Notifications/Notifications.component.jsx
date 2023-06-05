import { useOutside } from "hooks";
import { useSelector } from "react-redux";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Notifications.styles.scss";
import { Spin } from "antd";
// import {
//   NewUserRegistered,
//   TicketCreated,
//   TickedUpdated,
//   OrderCreated,
//   OrderUpdated,
//   TicketNewComments,
//   TicketNewReply,
//   CategoryGenerator,
//   Bills,
// } from './sections';
import moment from "moment";
import { getNotificationLink, getNotificationType, groupBy } from "lib";
import { Bell } from "icons/Notifications";
//import { getNotifications } from 'store';

export function Notifications({ toggleNotification }) {
  const notificationRef = useRef(null);

  //const dispatch = useDispatch();
  useOutside(notificationRef, toggleNotification);
  //let page = 1;

  const { notifications, loading } = useSelector(
    (state) => state?.notifications
  );
  const { user } = useSelector((state) => state?.auth);
  const [data, setData] = useState([]);
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;

  useEffect(() => {
    if (notifications?.length) {
      // const dataToSet = groupBy(notifications, 'type');
      setData(notifications);
    }
  }, [notifications]);

  return (
    <div
      className={`notifications fixed top-0 right-0 w-6/12 bg-[#000000] text-white `}
      ref={notificationRef}
    >
      <div
        className={`text-xl p-[32px] border-b-2 border-current border-dashed border-[#474761]`}
      >
        Notifications
      </div>
      <div className={`notifications-wrap px-[32px] pt-[32px] pb-[32px]`}>
        {loading || data === null ? (
          <div className={`pl-[60px] pt-[13px] pb-[13px] relative text-center`}>
            <Spin
              size="large"
              style={{ gridColumn: "1/3", alignSelf: "center" }}
            />
          </div>
        ) : (
          <>
            {notifications?.map((notification) => {
              return (
                <>
                  <div
                    className={`notification-block pl-[60px] pt-[13px] relative`}
                  >
                    <div className={`noti-icon`}>
                      <Bell fill={"#fff"} />
                    </div>
                    <div className={`noti-content`}>
                      <div className="flex justify-between">
                        <Link
                          className={`text-[#1890ff]`}
                          to={getNotificationLink({ type: notification?.type })}
                        >
                          {notification?.body
                            .replace("[[firstName]]", user.fullName)
                            .replace("[[fullName]]", user.fullName)}
                        </Link>
                        <div className={`flex`}>
                          {notification?.userImage && (
                            <img
                              alt={notification?.fullName}
                              src={notification?.userImage}
                              className="w-[20px] h-[20px] object-cover rounded-[50%]"
                            />
                          )}
                          <div className={`text-[#474761] ml-2`}>{`${
                            notification?.fullName
                          } added at ${moment(notification?.sentAt).format(
                            dateFormat
                          )}`}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            {/* {Object.entries(data).map(([key, value]) => {
              return (
                <React.Fragment key={key}>
                  {parseInt(key) === 0 ? (
                    <NewUserRegistered value={value} user={user} />
                  ) : parseInt(key) === 1 ? (
                    <TicketCreated value={value} user={user} />
                  ) : parseInt(key) === 2 ? (
                    <TickedUpdated value={value} user={user} />
                  ) : parseInt(key) === 6 ? (
                    <OrderCreated value={value} user={user} />
                  ) : parseInt(key) === 4 ? (
                    <OrderUpdated value={value} user={user} />
                  ) : parseInt(key) === 5 ? (
                    <TicketNewComments value={value} user={user} />
                  ) : parseInt(key) === 3 ? (
                    <TicketNewReply value={value} user={user} />
                  ) : parseInt(key) === 7 ? (
                    <CategoryGenerator value={value} user={user} />
                  ) : (
                    <Bills value={value} user={user} />
                  )}
                </React.Fragment>
              );
            })} */}
            {/* <div
              className={`fixed bottom-0 left-0 w-full p-[32px] border-t-2 border-current border-dashed border-[#474761] text-center`}
            >
              <Link to={''} className={`text-[#3699FF]`}>
                View All Notifications
              </Link>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}
