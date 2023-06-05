import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  smtps: [],
  loading: false,
};
const smtpSlice = createSlice({
  name: 'smtps',
  initialState,
  reducers: {
    getSMTPs: (state, { payload }) => {
      state.smtps = payload;
    },
    setSMTPLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = smtpSlice;

export const { getSMTPs, setSMTPLoading } = actions;
export default reducer;
