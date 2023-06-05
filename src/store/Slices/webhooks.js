import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  webhooks: [],
  loading: false,
};
const webHooksSlice = createSlice({
  name: 'webHooks',
  initialState,
  reducers: {
    getWebHooksDispatch: (state, { payload }) => {
      state.webhooks = payload;
    },
    setWebHooksLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = webHooksSlice;

export const { getWebHooksDispatch, setWebHooksLoading } = actions;
export default reducer;
