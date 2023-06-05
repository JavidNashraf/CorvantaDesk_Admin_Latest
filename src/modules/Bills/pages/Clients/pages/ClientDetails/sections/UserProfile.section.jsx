import { getName, getTimeDiff } from "lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import moment from "moment";
// import { EditUser } from '../../sections';

export const UserProfileCard = () => {
  const [showName, setShowName] = useState(true);
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const { user, loading } = useSelector((state) => state.users);
  const { t } = useTranslation("Users/ns");

  const userInfo = {
    name: user?.fullName,
    img: "data:image/png;base64," + user?.base64Image,
    designation: "Client",
    details: [
      { title: t("accountID"), value: user?.id },
      { title: t("billingEmail"), value: user?.email },
      {
        title: t("billingAddress"),
        value:
          user?.address1 || user?.address2
            ? `${user?.address1} ${user?.address2}`
            : "101 Collin Street, Melbourne 3000, Australia",
      },
      { title: t("language"), value: "English" },
      // { title: "Status", value: user?.isActive ? "Active" : "Inactive" },
      {
        title: "Signup date",
        value: moment(user?.createdOn).format(localStorage.getItem('dateFormat')),
      },
      {
        title: "Last Login",
        value: moment(user?.lastLoggedIn) < moment(user?.createdOn) ? 'Never' : `${getTimeDiff(user?.lastLoggedIn)} ago`,
      },
    ],
  };

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div className="bg-[#000000] rounded-lg admin-details__user-card">
          {/* IMAGE + NAME */}
          <div className="admin-details__user-card-img">
            <div className="admin-details__user-card-img-box h-[120px] w-[120px] flex items-center justify-center">
              {userInfo?.img && userInfo?.img?.length && !showName ? (
                <img
                  src={user && "data:image/png;base64," + user.imageUrl}
                  alt={user && user.userName}
                  onLoad={() => setShowName(false)}
                  onError={() => setShowName(true)}
                  className="h-full w-full"
                />
              ) : (
                <div className="text-[36px] text-white">
                  {user && showName && getName({ user })}
                </div>
              )}
            </div>
            {/* NAME */}
            <div className="admin-details__user-card-name">
              <h6 className="text-xl text-[#fff]">{userInfo?.name}</h6>
            </div>
            {/* DESIGNATION */}
            <div className="admin-details__user-card-designation">
              <p className="text-[#474761] text-base">
                {userInfo?.designation}
              </p>
            </div>
          </div>
          {/* USER PROFILE DETAILS */}
          <div className="admin-details__user-card-details px-8">
            {/* FIRST ROW WITH EDIT BUTTON */}
            <div className="flex justify-between items-center">
              <h6 className="text-white text-[16px] mb-0">{t("details")}</h6>
              <div
                className={`bg-[${
                  user?.isActive ? "#1C3238" : "#3A2434"
                }] px-[8px] py-[4px] text-[${
                  user?.isActive ? "#0BB783" : "#F64E60"
                }] w-[fit-content] rounded-[4px] uppercase`}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </div>
            </div>
            <div className="h-0 w-full border-t-[1px] border-dashed border-[#323248] mt-4 mb-4" />
            {/* INFO ROW */}
            <div className="admin-details__user-card-details-detail flex flex-col gap-4">
              {userInfo?.details?.map(({ title, value }) => {
                return (
                  <div className="flex flex-col gap-1" key={title}>
                    <div className="text-white text-sm">{title}</div>
                    <div className="text-[#92928F] text-sm">{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
