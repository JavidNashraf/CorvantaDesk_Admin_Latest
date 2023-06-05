import {
  getError,
  axios,
  getInvoicesConfig,
  getInvoiceConfig,
  addCreditConfig,
  RemoveCreditConfig,
  BalanceCreditConfig,
  createInvoiceConfig,
  editInvoiceConfig
} from 'lib';
import { toast } from 'react-toastify';
import { getInvoicesDispatch, setInvoiceLoading, getInvoice } from 'store/Slices';
import { createInvoiceSlice, editInvoiceSlice, getAddCreditDispatch, getBalanceCreditDispatch, getRemoveCreditDispatch, invoicePaginationProps } from 'store/Slices/invoicesSlice';


// Get All Admin Invoice
export const getInvoices = (params = []) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true));
    try {
      const { url, defaultData, config } = getInvoicesConfig(params);
      if (params?.status) {
        defaultData.advancedSearch.fields.push('status');
        defaultData.advancedSearch.keyword = params?.status;
      }
      if (params?.startDate && params?.endDate) {
        defaultData['startDate'] = params?.startDate;
        defaultData['endDate'] = params?.endDate;
      }

      const res = await axios.post(url, defaultData, config);
      const paginationProps = {
        currentPage: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      }
      dispatch(invoicePaginationProps(paginationProps))
      dispatch(getInvoicesDispatch(res?.data?.data));
      dispatch(setInvoiceLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setInvoiceLoading(false));
    }
  };
};

//Search Invoices
export const getSearchInvoices = (data) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true));
    try {
      const { url, config } = getInvoicesConfig();
      const res = await axios.post(url, data, config);
      dispatch(getInvoicesDispatch(res?.data?.data));
      const paginationProps = {
        currentPage: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      }
      dispatch(invoicePaginationProps(paginationProps))
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setInvoiceLoading(false));
    }
  };
};

// Get User By ID
export const getInvoiceById = (id) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true));
    try {
      const { url, config } = getInvoiceConfig(id);
      const res = await axios.get(url, config);
      dispatch(getInvoice(res?.data?.data));
      dispatch(setInvoiceLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setInvoiceLoading(false));
    }
    finally {
      dispatch(setInvoiceLoading(false));
    }
  };
};

//Add Credit
export const getAddCredit = (data) => {
  return async (dispatch) => {
    try {
      dispatch(setInvoiceLoading(true));
      const { url, config } = addCreditConfig();
      const res = await axios.post(url, data, config);
      if (res?.data?.data) {
        await dispatch(getAddCreditDispatch(res?.data?.data));
      }
    } catch (e) {
      toast.error(getError(e));
    }
    finally {
      dispatch(setInvoiceLoading(false));
    }
  }
}

//Remove Credit
export const getRemoveCredit = (data) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true));
    try {
      const { url, config } = RemoveCreditConfig();
      const res = await axios.post(url, data, config);
      dispatch(getRemoveCreditDispatch(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setInvoiceLoading(false));
    }
  }
}

//Credit Balance
export const getBalanceCredit = (id, data) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true));
    try {
      const { url, config } = BalanceCreditConfig(id);
      const res = await axios.get(url, data, config);
      dispatch(getBalanceCreditDispatch(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setInvoiceLoading(false));
    }
  }
}

// create invoice
export const createInvoice = (data) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true));
    try {
      const { url, config } = createInvoiceConfig();
      const res = await axios.post(url, data, config);
      dispatch(createInvoiceSlice(res?.data?.data));
      if(res?.status === 200){
        toast.success('Invoice added Successfully');
        }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setInvoiceLoading(false));
    }
  };
};

//update invoice
export const updateInvoice = (id,data) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true));
    try {
      const { url, config } = editInvoiceConfig(id);
      const res = await axios.put(url, data, config);
      if(res?.status === 200){
      toast.success('Invoice updated Successfully');
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setInvoiceLoading(false));
    }
  };
};
