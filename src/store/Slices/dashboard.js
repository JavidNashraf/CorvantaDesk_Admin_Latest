
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  incomeOverview: [],
  loading: false,
  incomeForecast: [],
  incomeOverviewList: [],
  paginationProps: {}
};
const invoiceOverviewSlice = createSlice({
  name: 'incomeOverview',
  initialState,
  reducers: {
    getIncomeOverviewDispatch: (state, { payload }) => {
      state.incomeOverview = payload;
    },
    setIncomeLoading: (state, { payload }) => {
      state.loading = payload;
    },
    getIncomeForecastDispatch: (state, { payload }) => {
      state.incomeForecast = payload;
    },
    getIncomeOverviewListDispatch: (state, { payload }) => {
      state.incomeOverviewList = payload;
    },
    getIncomeOverviewListPaginationProps: (state, { payload }) => {
      state.paginationProps = payload;
    },
    setReceiveOrdersLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = invoiceOverviewSlice;
export const { InvoiceOverviewList, getIncomeOverviewDispatch, setIncomeLoading, getIncomeForecastDispatch, getIncomeOverviewListDispatch, getIncomeOverviewListPaginationProps, setReceiveOrdersLoading } =
  actions;

export default reducer;
