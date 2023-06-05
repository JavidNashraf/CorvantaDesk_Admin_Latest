import { getError, axios } from 'lib';
import { toast } from 'react-toastify';
import { getDataCountsConfig } from "lib/requests/count";
import { setCount, setCountLoading } from 'store/Slices/dataCount';


// Get Data Counts
export const getDataCounts = () => {
  return async (dispatch) => {
    dispatch(setCountLoading(true));
    try {
      const { url, config } = getDataCountsConfig();
      const res = await axios.get(url, config);
      dispatch(setCount(res?.data?.data));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setCountLoading(false));
    }
  };
};
