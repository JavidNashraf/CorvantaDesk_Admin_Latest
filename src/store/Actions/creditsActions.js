import { toast } from "react-toastify";
import { axios, getError } from "lib";
import { createCreditConfig, decreaseCreditConfig, deleteCreditConfig, getCreditsConfig, increaseCreditConfig, updateCreditConfig, getCreditBalanceByClientConfig } from "lib/requests/credits";
import {
  getCreditsDispatch,
  setCreditLoading,
  getCreditBalance,
} from "store/Slices";

// Get All Credits
export const getCredits = (creditId) => {
  return async (dispatch) => {
    dispatch(setCreditLoading(true));
    try {
      const { url, defaultData } = getCreditsConfig();
      const searchParam = {
        advancedSearch: {
          fields: ["userId"],
          keyword: creditId ?? ""
        }
      };
      const res = await axios.post(url, {
        ...defaultData,
        ...searchParam,
      });
      dispatch(getCreditsDispatch(res?.data?.data));
      dispatch(setCreditLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setCreditLoading(false));
    }
  };
};

// Get Credit Balance
export const getCreditBalanceByClient = (clientId) => {
  return async (dispatch) => {
    try {
      const { url, config } = getCreditBalanceByClientConfig(clientId);
      const res = await axios.get(url, config);
      dispatch(getCreditBalance(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    }
  };
};

export const storeCredit = ({ id, data, onSuccess, onFail }) => {
  return async (dispatch) => {
    dispatch(setCreditLoading(true));
    try {
      let res = null;
      if (id) {
        const { url, config } = updateCreditConfig(id);
        res = await axios.put(url, data, config);
      } else {
        const { url, config } = createCreditConfig();
        res = await axios.post(url, data, config);
      }

      if (res?.status === 200) {
        const { url, defaultData, config } = getCreditsConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getCreditsDispatch(res?.data?.data));
        toast.success("Credit saved successfully");
        onSuccess && onSuccess();
      } else {
        onFail && onFail();
      }
      dispatch(setCreditLoading(false));
    } catch (e) {
      dispatch(setCreditLoading(false));
      toast.error(getError(e));
      onFail && onFail();
    } finally {
      dispatch(setCreditLoading(false));
    }
  };
};

export const increaseCredit = ({ data, onSuccess, onFail }) => {
  return async (dispatch) => {
    dispatch(setCreditLoading(true));
    try {
      const { url } = increaseCreditConfig();
      const res = await axios.post(url, data);

      if (res?.status === 200) {
        toast.success("Credit added successfully");
        dispatch(getCreditBalance(res?.data?.data?.balance));
        onSuccess && onSuccess()
      } else {
        onFail && onFail();
      }
      dispatch(setCreditLoading(false));
    } catch (e) {
      dispatch(setCreditLoading(false));
      toast.error(getError(e));
      onFail && onFail();
    } finally {
      dispatch(setCreditLoading(false));
    }
  };
};

export const decreaseCredit = ({ id, data, onSuccess, onFail }) => {
  return async (dispatch) => {
    dispatch(setCreditLoading(true));
    try {
      const { url } = decreaseCreditConfig();
      const res = await axios.post(url, data);

      if (res?.status === 200) {
        toast.success("Removal Credit saved successfully");
        dispatch(getCreditBalance(res?.data?.data?.balance));
        onSuccess && onSuccess();
      } else {
        onFail && onFail();
      }
      dispatch(setCreditLoading(false));
    } catch (e) {
      dispatch(setCreditLoading(false));
      toast.error(getError(e));
      onFail && onFail();
    } finally {
      dispatch(setCreditLoading(false));
    }
  };
};

export const deleteCreditByID = (id) => {
  return async (dispatch) => {
    dispatch(setCreditLoading(true));

    try {
      const { url } = deleteCreditConfig(id);
      const res = await axios.delete(url);
      if (res.status === 200) {
        dispatch(getCredits());
        toast.success("Credit deleted successfully");
      }
      dispatch(setCreditLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setCreditLoading(false));
    } finally {
      dispatch(setCreditLoading(false));
    }
  };
};