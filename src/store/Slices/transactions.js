import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  loading: false,
};
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    getTransactionsDispatch: (state, { payload }) => {
      state.transactions = payload;
    },
    setTransactionsLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = transactionsSlice;

export const { getTransactionsDispatch, setTransactionsLoading } = actions;
export default reducer;
