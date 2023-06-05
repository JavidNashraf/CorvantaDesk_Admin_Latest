// getArticleCategoriesConfig

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articleCategories: [],
  articleCategory: null,
  loading: false,
};

const articleCategories = createSlice({
  name: 'articleCategories',
  initialState,
  reducers: {
    setArticleCategoriesLoading: (state, { payload }) => {
      state.loading = payload;
    },
    getArticleCategories: (state, { payload }) => {
      state.articleCategories = payload;
    },
    getArticleCategory: (state, { payload }) => {
      state.articleCategory = payload;
    },
  },
});

const { actions, reducer } = articleCategories;

export const {
  setArticleCategoriesLoading,
  getArticleCategories,
  getArticleCategory,
} = actions;

export default reducer;
