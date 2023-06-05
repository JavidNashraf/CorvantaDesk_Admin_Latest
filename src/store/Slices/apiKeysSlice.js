import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  apiKeys: [],
  apiKey: null,
  loading: false,
};
const apiKeysSlice = createSlice({
  name: 'apiKeys',
  initialState,
  reducers: {
    getAPIKeys: (state, { payload }) => {
      state.apiKeys = payload;
    },
    getAPIKey: (state, { payload }) => {
      state.apiKey = payload;
    },
    setAPILoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = apiKeysSlice;

export const { getAPIKeys, getAPIKey, setAPILoading } = actions;
export default reducer;
