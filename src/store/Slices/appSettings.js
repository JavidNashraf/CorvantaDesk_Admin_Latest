import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  settings: null,
  appSettingsSlice: null,
  billingSettings: null,
  maintenanceSettings: null,
  supportSettings: null,
  loading: false,
  appSettings: {}
};

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setAppSettingsLoading: (state, { payload }) => {
      state.loading = payload;
    },
    getAppSettings: (state, { payload }) => {
      state.settings = payload;
      localStorage.setItem("dateFormat", payload?.dateFormat);
    },
    getBillingSettings: (state, { payload }) => {
      state.billingSettings = payload;
    },
    getMaintenanceSettings: (state, { payload }) => {
      state.maintenanceSettings = payload;
    },
    getSupportSettings: (state, { payload }) => {
      state.supportSettings = payload;
    },
  },
});

const { actions, reducer } = appSettingsSlice;

export const {
  setAppSettingsLoading,
  getAppSettings,
  getBillingSettings,
  getMaintenanceSettings,
  getSupportSettings,
} = actions;

export default reducer;
