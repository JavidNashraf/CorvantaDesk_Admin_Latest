import {
  addPaymentGatewayConfig,
  axios,
  deletePaymentGatewayConfig,
  editPaymentGatewayConfig,
  getError,
  getPaymentGatewaysConfig,
} from 'lib';
import { toast } from 'react-toastify';
import { getPaymentGateways, setPaymentGatewaysLoading } from 'store/Slices';

export const getAllPaymentGateways = () => {
  return async (dispatch) => {
    dispatch(setPaymentGatewaysLoading(true));
    try {
      const { url, defaultData, config } = getPaymentGatewaysConfig();
      const response = await axios.post(url, defaultData, config);
      dispatch(getPaymentGateways(response?.data?.data));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setPaymentGatewaysLoading(false));
    }
  };
};

export const addPaymentGateway = ({ data }) => {
  return async (dispatch) => {
    dispatch(setPaymentGatewaysLoading(true));
    try {
      const { url, config } = addPaymentGatewayConfig();
      const response = await axios.post(url, data, config);
      if (response.status === 200) {
        const { url, defaultData, config } = getPaymentGatewaysConfig();
        const response = await axios.post(url, defaultData, config);
        dispatch(getPaymentGateways(response?.data?.data));
        toast.success('Payment Gateway Added Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setPaymentGatewaysLoading(false));
    }
  };
};

export const editPaymentGateway = ({ data }) => {
  return async (dispatch) => {
    dispatch(setPaymentGatewaysLoading(true));
    try {
      const { url, config } = editPaymentGatewayConfig({ id: data?.id });
      const response = await axios.put(url, data, config);
      if (response.status === 200) {
        const { url, defaultData, config } = getPaymentGatewaysConfig();
        const response = await axios.post(url, defaultData, config);
        dispatch(getPaymentGateways(response?.data?.data));
        toast.success('Payment Gateway Updated Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setPaymentGatewaysLoading(false));
    }
  };
};

export const deletePaymentGateway = ({ id }) => {
  return async (dispatch) => {
    dispatch(setPaymentGatewaysLoading(true));
    try {
      const { url, config } = deletePaymentGatewayConfig({ id });
      const response = await axios.delete(url, config);
      if (response.status === 200) {
        const { url, defaultData, config } = getPaymentGatewaysConfig();
        const response = await axios.post(url, defaultData, config);
        dispatch(getPaymentGateways(response?.data?.data));
        toast.success('Payment Gateway Deleted Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setPaymentGatewaysLoading(false));
    }
  };
};
