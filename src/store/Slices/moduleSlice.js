import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appModules: [],
  userModules: [],
  loading: false,
};
const settingSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    getAppLevelModules: (state, { payload }) => {
      state.appModules = payload;
    },
    getUserLevelModules: (state, { payload }) => {
      state.userModules = payload;
    },
    setModuleLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = settingSlice;

export const { getAppLevelModules, getUserLevelModules, setModuleLoading } =
  actions;
export default reducer;
