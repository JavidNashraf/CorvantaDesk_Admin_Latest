import { axios, getError } from "lib";
import { importDataConfig, validateDataConfig } from "lib/requests/whmcs";
import { toast } from "react-toastify";
import {
  getValidateData,
  setWHMCSError,
  setWHMCSLoading,
  setWHMCSFileType,
  getSelectedData,
  setImportProgres,
  setWHMCSFile,
  setImportError,
} from "store/Slices";

export const clearWHMCSState = () => {
  return async (dispatch) => {
    dispatch(setWHMCSError(false));
    dispatch(setWHMCSLoading(false));
    dispatch(getValidateData([]));
    dispatch(setWHMCSFileType(0));
  };
};

export const validateWHMCSData = ({ data }) => {
  return async (dispatch) => {
    dispatch(setWHMCSLoading(true));
    try {
      const { url, config } = validateDataConfig();
      dispatch(setWHMCSFileType(data?.whmcsFileType));
      dispatch(setWHMCSFile(data?.jsonFile));
      const response = await axios.post(url, data, config);
      if (response?.data?.content) {
        dispatch(
          getValidateData(JSON.parse(response && response?.data?.content))
        );
        dispatch(setWHMCSError(false));
      }
      if (response?.data?.rowValidationErrors?.length) {
        dispatch(setWHMCSError(response?.data?.rowValidationErrors));
      } else {
        dispatch(setWHMCSError(false));
      }
      return response;
    } catch (error) {
      dispatch(setWHMCSError(error?.response?.data));
    } finally {
      dispatch(setWHMCSLoading(false));
    }
  };
};

export const selectData = ({ data }) => {
  return async (dispatch) => {
    dispatch(setWHMCSLoading(true));
    try {
      dispatch(getSelectedData(data));
    } catch (error) {
      dispatch(setWHMCSError(error));
    } finally {
      dispatch(setWHMCSLoading(false));
    }
  };
};

export const importData = ({ data }) => {
  return async (dispatch) => {
    dispatch(setWHMCSLoading(true));
    try {
      const { url, config } = importDataConfig();
      const res = await axios.post(url, data);
      if (res?.status === 200 && res?.data?.[0]?.succeeded) {

        dispatch(setImportProgres(100));
        toast.success("Data imported successfuly");
      }
      else if (res?.status === 200 && !res?.data?.[0]?.succeeded) {
        const emailError = res?.data?.[0]?.messages?.[0]?.split(" ")
        const removedItem = emailError?.splice(emailError.length - 1, 1)
        dispatch(setImportProgres(90));
        dispatch(setImportError(res?.data));
        toast.error(emailError?.join(" "));
      }

      else {
        dispatch(setImportProgres(90));
        dispatch(setImportError(res?.data));
        toast.error(getError());
      }

    } catch (error) {
      dispatch(setImportProgres(90));
      dispatch(setImportError(error?.response?.data));
      toast.error(getError(error));
    } finally {
      dispatch(setWHMCSLoading(false));
    }
  };
};
