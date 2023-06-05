import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    brands: [],
    loading: false,
    brand:null
};
const brandsSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {
        getBrands: (state, { payload }) => {
            state.brands = payload;
        },
        setBrandsLoading: (state, { payload }) => {
            state.loading = payload;
        },
        getBrand: (state, { payload }) => {
            state.brand = payload;
        },
    },
});

const { reducer, actions } = brandsSlice;
export const { getBrands, setBrandsLoading,getBrand } = actions;

export default reducer;
