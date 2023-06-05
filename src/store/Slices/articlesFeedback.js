import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articlesFeedbacks: [],
  articlesFeedback: null,
  loading: false,
  pendingFeedbackCount: 0,
  pendingCountLoading: false,
};

const articlesFeedbackSlice = createSlice({
  name: 'articlesFeedback',
  initialState,
  reducers: {
    setArticlesFeedbackLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setPendingFeedbackCountLoading: (state, { payload }) => {
      state.pendingCountLoading = payload;
    },
    getArticleFeedbacks: (state, { payload }) => {
      state.articlesFeedbacks = payload;
    },
    getArticleFeedback: (state, { payload }) => {
      state.articlesFeedback = payload;
    },
    getPendingFeedbackCount: (state, { payload }) => {
      state.pendingFeedbackCount = payload;
    },
  },
});

const { actions, reducer } = articlesFeedbackSlice;

export const {
  setArticlesFeedbackLoading,
  getArticleFeedbacks,
  getArticleFeedback,
  setPendingFeedbackCountLoading,
  getPendingFeedbackCount,
} = actions;

export default reducer;
