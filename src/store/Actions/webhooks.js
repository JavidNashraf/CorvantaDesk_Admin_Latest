import { axios, getError } from 'lib';
import {
  getAllWebHooksConfig,
  addWebHookConfig,
  editWebHookConfig,
  deleteWebHookConfig,
} from 'lib/requests/webhooks';
import { toast } from 'react-toastify';
import { getWebHooksDispatch, setWebHooksLoading } from 'store/Slices';

export const getWebHooks = () => {
  return async (dispatch) => {
    dispatch(setWebHooksLoading(true));
    try {
      const { url, defaultData, config } = getAllWebHooksConfig();
      const response = await axios.post(url, defaultData, config);
      dispatch(getWebHooksDispatch(response?.data?.data));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setWebHooksLoading(false));
    }
  };
};

export const addWebhook = ({ data }) => {
  return async (dispatch) => {
    dispatch(setWebHooksLoading(true));
    try {
      const { url, config } = addWebHookConfig();
      const response = await axios.post(url, data, config);
      if (response.status === 200) {
        const { url, defaultData, config } = getAllWebHooksConfig();
        const response = await axios.post(url, defaultData, config);
        dispatch(getWebHooksDispatch(response?.data?.data));
        toast.success('Web Hook Added Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setWebHooksLoading(false));
    }
  };
};

export const editWebhook = ({ data }) => {
  return async (dispatch) => {
    dispatch(setWebHooksLoading(true));
    try {
      const { url, config } = editWebHookConfig({ id: data?.id });
      const response = await axios.put(url, data, config);
      if (response.status === 200) {
        const { url, defaultData, config } = getAllWebHooksConfig();
        const response = await axios.post(url, defaultData, config);
        dispatch(getWebHooksDispatch(response?.data?.data));
        toast.success('Webhook Updated Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setWebHooksLoading(false));
    }
  };
};

export const deleteWebhook = ({ id }) => {
  return async (dispatch) => {
    dispatch(setWebHooksLoading(true));
    try {
      const { url, config } = deleteWebHookConfig({ id });
      const response = await axios.delete(url, config);
      if (response.status === 200) {
        const { url, defaultData, config } = getAllWebHooksConfig();
        const response = await axios.post(url, defaultData, config);
        dispatch(getWebHooksDispatch(response?.data?.data));
        toast.success('Webhook Deleted Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setWebHooksLoading(false));
    }
  };
};
