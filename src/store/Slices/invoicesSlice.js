import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    invoices: [],
    loading: false,
    invoice: null,
    addCredit:[],
    removeCredit:[],
    balanceCredit:"",
    createInvoice: [],
    editInvoice: [],
    paginationProps:[]
};

const invoicesSlice = createSlice({
    name: "invoices",
    initialState,
    reducers: {
        getInvoices: (state, { payload }) => {
            state.invoices = payload;
        },
        getInvoice: (state, { payload }) => {
            state.invoice = payload;
        },
        setInvoiceLoading: (state, { payload }) => {
            state.loading = payload;
        },
        getAddCreditDispatch: (state, { payload }) => {
            state.addCredit = payload;
        },
        getRemoveCreditDispatch: (state, { payload }) => {
            state.removeCredit = payload;
        },
        getBalanceCreditDispatch: (state, { payload }) => {
            state.balanceCredit = payload;
        },
        createInvoiceSlice: (state, { payload }) => {
            state.createInvoice = payload;
        },
        editInvoiceSlice: (state, { payload }) => {
            state.editInvoice = payload;
        },
        invoicePaginationProps: (state, { payload }) => {
            state.paginationProps = payload;
        },

    }
})

const { reducer, actions } = invoicesSlice;
export const { getInvoices, getInvoice, setInvoiceLoading,getAddCreditDispatch,getRemoveCreditDispatch,getBalanceCreditDispatch, createInvoiceSlice, editInvoiceSlice,invoicePaginationProps} = actions;

export default reducer;