import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paymentGateways: [],
  loading: false,
};
const paymentGatewaySlice = createSlice({
  name: 'paymentGateways',
  initialState,
  reducers: {
    getPaymentGateways: (state, { payload }) => {
      state.paymentGateways = payload;
    },
    setPaymentGatewaysLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = paymentGatewaySlice;

export const { getPaymentGateways, setPaymentGatewaysLoading } = actions;
export default reducer;
