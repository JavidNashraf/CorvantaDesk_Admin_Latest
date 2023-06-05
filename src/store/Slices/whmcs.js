import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  validatedData: [],
  selectedData: [],
  error: false,
  loading: false,
  whmcsFileType: 0,
  importProgress: 0,
  importError: null,
  jsonFile: null,
};
const whmcsSlice = createSlice({
  name: 'whmcs',
  initialState,
  reducers: {
    getSelectedData: (state, { payload }) => {
      state.selectedData = payload;
    },
    getValidateData: (state, { payload }) => {
      state.validatedData = payload;
    },
    setWHMCSFileType: (state, { payload }) => {
      state.whmcsFileType = payload;
    },
    setWHMCSFile: (state, { payload }) => {
      state.jsonFile = payload;
    },
    setWHMCSLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setWHMCSError: (state, { payload }) => {
      state.error = payload;
    },
    setImportProgres: (state, { payload }) => {
      state.importProgress = payload;
    },
    setImportError: (state, { payload }) => {
      state.importError = payload;
    },
  },
});

const { reducer, actions } = whmcsSlice;
export const {
  getSelectedData,
  getValidateData,
  setWHMCSFileType,
  setWHMCSFile,
  setWHMCSLoading,
  setWHMCSError,
  setImportError,
  setImportProgres,
} = actions;

export default reducer;
