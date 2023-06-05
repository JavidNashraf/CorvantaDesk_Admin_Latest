import {
  getError,
  axios,
  getNotificationsConfig,
  notificationsReadConfig,
} from "lib";
import { toast } from "react-toastify";
import { getNotificationsDispatch, setNotificationLoading } from "store/Slices";

// Get All Admin Notifications
export const getNotificationss = (params = {}) => {
  return async (dispatch) => {
    dispatch(setNotificationLoading(true));
    try {
      const { url, defaultData, config } = getNotificationsConfig();
      if (params?.toUserId) {
        defaultData.advancedSearch.fields.push("toUserId");
        defaultData.advancedSearch.keyword = params?.toUserId;
      }

      const res = await axios.post(url, defaultData, config);
      dispatch(getNotificationsDispatch(res?.data?.data));
      dispatch(setNotificationLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setNotificationLoading(false));
    }
  };
};

export const notificationsRead = (ids) => {
  return async (dispatch) => {
    dispatch(setNotificationLoading(true));
    try {
      const { url, config } = notificationsReadConfig();
      const res = await axios.put(url, ids, config);
      dispatch(getNotificationsDispatch(res?.data?.data));
      dispatch(setNotificationLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setNotificationLoading(false));
    }
  };
};
