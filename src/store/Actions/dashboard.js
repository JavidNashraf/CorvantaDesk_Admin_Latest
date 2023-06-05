import { toast } from "react-toastify/dist";
import { axios, getError } from "lib";
import {
  getIncomeForecastConfig,
  getIncomeOverviewConfig,
  getIncomeOverviewListConfig,
  getInvoiceForecastConfig,
  getInvoiceOverviewConfig
} from "lib/requests/dashboard";
import {
  getIncomeForecastDispatch,
  getIncomeOverviewDispatch,
  getIncomeOverviewListDispatch,
  getIncomeOverviewListPaginationProps,
  getInvoiceOverviewDispatch,
  setIncomeLoading
} from "store/Slices/dashboard";

// Get Invoice Overview
export const getIncomeOverview = () => {
  return async (dispatch) => {
    dispatch(setIncomeLoading(true));
    try {
      const { url, config } = getIncomeOverviewConfig();
      const res = await axios.get(url, config);
      dispatch(getIncomeOverviewDispatch(res?.data));
    } catch (error) {

      toast.error(getError(error));
    } finally {
      dispatch(setIncomeLoading(false));
    }
  };
};
//Get Invoice Forecast
export const getIncomeForecast = () => {
  return async (dispatch) => {
    dispatch(setIncomeLoading(true));
    try {
      const { url, config } = getIncomeForecastConfig();
      const res = await axios.get(url, config);
      dispatch(getIncomeForecastDispatch(res?.data));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setIncomeLoading(false));
    }
  };
};

//Get Invoice Overview List
export const getIncomeOverviewList = (params = []) => {
  return async (dispatch) => {
    dispatch(setIncomeLoading(true));
    try {
      const { url, defaultData, config } = getIncomeOverviewListConfig(params);
      if (params?.transactionStatus) {
        defaultData['transactionStatus'] = Number(params?.transactionStatus);
      }
      if (params?.startDate && params?.endDate) {
        defaultData['startDate'] = params?.startDate;
        defaultData['endDate'] = params?.endDate;
      }
      const res = await axios.post(url, defaultData, config);
      dispatch(getIncomeOverviewListDispatch(res?.data?.data));
      const paginationProps = {
        currentPage: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      }
      dispatch(setIncomeLoading(false));
      dispatch(getIncomeOverviewListPaginationProps(paginationProps))
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setIncomeLoading(false));
    }
  };
};

//Search Income Overview List
// Search API keys
export const getSearchIncomeOverviewList = (data) => {
  return async (dispatch) => {
    dispatch(setIncomeLoading(true));
    try {
      const { url, config } = getIncomeOverviewListConfig();
      const res = await axios.post(url, data, config);
      dispatch(getIncomeOverviewListDispatch(res?.data?.data));
      const paginationProps = {
        currentPage: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      }
      dispatch(getIncomeOverviewListPaginationProps(paginationProps))
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setIncomeLoading(false));
    }
  };
};