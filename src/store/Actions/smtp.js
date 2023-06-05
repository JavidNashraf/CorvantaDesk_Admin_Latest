import {
  axios,
  getError,
  addSMTPConfig,
  getAllSMTPsConfig,
  deleteSMTPConfig,
  editSMTPConfig,
} from 'lib';
import { toast } from 'react-toastify';
import { getSMTPs, setSMTPLoading } from 'store/Slices';

export const getAllSMTPs = () => {
  return async (dispatch) => {
    dispatch(setSMTPLoading(true));
    try {
      const { url, defaultData, config } = getAllSMTPsConfig();
      const response = await axios.post(url, defaultData, config);
      dispatch(getSMTPs(response?.data?.data));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setSMTPLoading(false));
    }
  };
};

export const addSMTP = ({ data }) => {
  return async (dispatch) => {
    dispatch(setSMTPLoading(true));
    try {
      const { url, config } = addSMTPConfig();
      const response = await axios.post(url, data, config);
      if (response.status === 200) {
        const { url, defaultData, config } = getAllSMTPsConfig();
        const response = await axios.post(url, defaultData, config);
        dispatch(getAllSMTPs(response?.data?.data));
        toast.success('SMTP Configuration Added Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setSMTPLoading(false));
    }
  };
};

export const editSMTP = ({ data }) => {
  return async (dispatch) => {
    dispatch(setSMTPLoading(true));
    try {
      const { url, config } = editSMTPConfig({ id: data?.id });
      const response = await axios.put(url, data, config);
      if (response.status === 200) {
        const { url, defaultData, config } = getAllSMTPsConfig();
        const response = await axios.post(url, defaultData, config);
        dispatch(getAllSMTPs(response?.data?.data));
        toast.success('SMTP Configuration Updated Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setSMTPLoading(false));
    }
  };
};

export const deleteSMTP = ({ id }) => {
  return async (dispatch, getState) => {
    dispatch(setSMTPLoading(true));
    try {
      const { url, config } = deleteSMTPConfig({ id });
      const response = await axios.delete(url, config);
      if (response.status === 200) {
        const { smtps } = getState().smtps;
        const newSMTPs = smtps.filter((key) => key.id !== id);
        dispatch(getSMTPs(newSMTPs));
        toast.success('SMTP Configuration Deleted Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setSMTPLoading(false));
    }
  };
};
