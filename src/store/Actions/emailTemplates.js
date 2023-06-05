import {
  addEmailTemplateConfig,
  axios,
  editEmailTemplateConfig,
  getAllEmailTemplatesConfig,
  getEmailTemplateByIdConfig,
  getError,
} from 'lib';
import { toast } from 'react-toastify';
import {
  getEmailTemplate,
  getEmailTemplates,
  setEmailTemplatesLoading,
} from 'store/Slices';

// Get All Email Templates
export const getAllEmailTemplates = () => {
  return async (dispatch) => {
    dispatch(setEmailTemplatesLoading(true));
    try {
      const { url, defaultData, config } = getAllEmailTemplatesConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getEmailTemplates(res?.data?.data));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setEmailTemplatesLoading(false));
    }
  };
};

// Add Email Template
export const addEmailTemplate = ({ data }) => {
  return async (dispatch) => {
    dispatch(setEmailTemplatesLoading(true));
    try {
      const { url, config } = addEmailTemplateConfig();
      const res = await axios.post(url, data, config);
      if (res?.status === 200) {
        const { url, defaultData, config } = getAllEmailTemplatesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getEmailTemplates(res?.data?.data));
        toast.success('Email Template Added Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setEmailTemplatesLoading(false));
    }
  };
};

// Get Email Template By ID
export const getEmailTemplateByID = ({ id }) => {
  return async (dispatch) => {
    dispatch(setEmailTemplatesLoading(true));
    try {
      const { url, config } = getEmailTemplateByIdConfig({ id });
      const res = await axios.get(url, config);
      if (res?.status === 200) {
        dispatch(getEmailTemplate(res?.data?.data));
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setEmailTemplatesLoading(false));
    }
  };
};

// Update Email Teamplte
export const updateEmailTemplate = ({ id, data }) => {
  return async (dispatch) => {
    dispatch(setEmailTemplatesLoading(true));
    try {
      const { url, config } = editEmailTemplateConfig({ id });
      const res = await axios.put(url, data, config);
      if (res?.status === 200) {
        const { url, defaultData, config } = getAllEmailTemplatesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getEmailTemplates(res?.data?.data));
        toast.success('Email Template Updated Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setEmailTemplatesLoading(false));
    }
  };
};

// Delete Email Template
export const deleteEmailTemplate = ({ id }) => {
  return async (dispatch, getState) => {
    dispatch(setEmailTemplatesLoading(true));
    try {
      const { url, config } = editEmailTemplateConfig({ id });
      const res = await axios.delete(url, config);
      if (res?.status === 200) {
        const { emailTemplates } = getState().emailTemplates;
        const newTemplates = emailTemplates.filter((key) => key.id !== id);
        dispatch(getEmailTemplates(newTemplates));
        toast.success('Email Template Deleted Successfully');
      }
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setEmailTemplatesLoading(false));
    }
  };
};
