import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  credits: [],
  credit: null,
};

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    getCredits: (state, { payload }) => {
      state.credits = payload;
    },
    setCreditLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = creditsSlice;
export const {
  getCredits,
  setCreditLoading,
} = actions;

export default reducer;
