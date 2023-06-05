import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scripts: [],
  loading: false,
  result: null,
  running: false,
};
const ScriptingSlice = createSlice({
  name: 'scripting',
  initialState,
  reducers: {
    getScriptsDispatch: (state, { payload }) => {
        state.scripts = payload;
        },
    setScriptsLoading: (state, { payload }) => {
        state.loading = payload;
        },
    setScriptResult: (state, { payload }) => {
        state.result = payload;
        },
    setScriptRunning: (state, { payload }) => {
        state.running = payload;
        },
  },
});

const { reducer, actions } = ScriptingSlice;

export const {
    getScriptsDispatch,
    setScriptsLoading,
    setScriptResult,
    setScriptRunning,
} = actions;
export default reducer;
