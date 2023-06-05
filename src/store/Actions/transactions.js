import { axios, getError, getTransactionsConfig } from 'lib';
import { toast } from 'react-toastify';
import { getTransactionsDispatch, setTransactionsLoading } from 'store/Slices';

export const getTransactions = () => {
  return async (dispatch) => {
    dispatch(setTransactionsLoading(true));
    try {
      const { url, defaultData, config } = getTransactionsConfig();
      const response = await axios.post(url, defaultData, config);
      dispatch(getTransactionsDispatch(response?.data?.data));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setTransactionsLoading(false));
    }
  };
};
