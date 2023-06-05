import { Bell } from 'icons/Notifications/Bell.icon';
import moment from 'moment';
import { Link } from 'react-router-dom';

export const OrderCreated = ({ value, user }) => {
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;

  return (
    <>
      {Object.keys(value).length === 1 ? (
        <div
          className={`notification-block pl-[60px] pt-[13px] pb-[13px] relative`}
        >
          <div className={`noti-icon`}>
            <Bell fill={'#fff'} />
          </div>
          <div className={`noti-content`}>
            <div className="flex justify-between">
              <div className={`text-white`}>
                {value[0]?.body
                  .replace('[[firstName]]', user.fullName)
                  .replace('[[fullName]]', user.fullName)}
              </div>
              <div className={`flex`}>
                {value[0]?.userImage && (
                  <img
                    alt={value[0]?.fullName}
                    src={value[0]?.userImage}
                    className="w-[20px] h-[20px] object-cover rounded-[50%]"
                  />
                )}
                <div className={`text-[#474761] ml-2`}>{`${
                  value[0]?.fullName
                } added at ${moment(value[0]?.sentAt).format(localStorage.getItem('dateFormat'))}`}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`notification-block pl-[60px] pt-[13px] pb-[13px] relative`}
        >
          <div className={`noti-icon`}>
            <Bell fill={'#fff'} />
          </div>
          <div className={`noti-content`}>
            <div className="flex justify-between">
              <div className={`text-white`}>{`There are ${
                Object.keys(value).length
              } new orders has been created.`}</div>
              <div className={`flex`}>
                {value[0]?.userImage && (
                  <img
                    alt={value[0]?.fullName}
                    src={value[0]?.userImage}
                    className="w-[20px] h-[20px] object-cover rounded-[50%]"
                  />
                )}
                <div className={`text-[#474761] ml-2`}>{`${
                  value[0]?.fullName
                } added at ${moment(value[0]?.sentAt).format(localStorage.getItem('dateFormat'))}`}</div>
              </div>
            </div>
            <div className={`book-blocks`}>
              {Object.entries(value).map(([k, d]) => {
                return (
                  <div
                    key={k}
                    className={`book-block p-[16px] border-1 border-current border-dashed border-[#474761]`}
                  >
                    <div className="flex">
                      <div className="">
                        <Link className={`text-[#1890ff]`} to={'#'}>
                          {d?.body
                            .replace('[[firstName]]', user.fullName)
                            .replace('[[fullName]]', user.fullName)}
                        </Link>
                      </div>
                    </div>
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
