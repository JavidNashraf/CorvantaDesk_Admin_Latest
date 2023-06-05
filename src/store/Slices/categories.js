// getAllProducts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  loading: false,
};
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    getCategoriesDispatch: (state, { payload }) => {
      state.categories = payload;
    },
    setCategoriesLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = categoriesSlice;
export const { getCategoriesDispatch, setCategoriesLoading } = actions;

export default reducer;
