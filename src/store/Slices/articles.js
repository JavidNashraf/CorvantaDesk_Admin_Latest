import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articles: [],
  article: null,
  loading: false,
  recentArticles: [],
  userSubmissions: [],
  userSubmissionsCount: 0,
  countLoading: false,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setArticlesLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setCountLoading: (state, { payload }) => {
      state.countLoading = payload;
    },
    getArticles: (state, { payload }) => {
      state.articles = payload;
    },
    getArticle: (state, { payload }) => {
      state.article = payload;
    },
    getRecentArticles: (state, { payload }) => {
      state.recentArticles = payload;
    },
    getUserSubmissions: (state, { payload }) => {
      state.userSubmissions = payload;
    },
    getUserSubmissionsCount: (state, { payload }) => {
      state.userSubmissionsCount = payload;
    }
  },
});

const { actions, reducer } = articlesSlice;

export const {
  setArticlesLoading,
  getArticles,
  getArticle,
  getRecentArticles,
  getUserSubmissions,
  getUserSubmissionsCount,
  setCountLoading,
} = actions;

export default reducer;
