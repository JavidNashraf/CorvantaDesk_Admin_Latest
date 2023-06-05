import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allOrders: [],
  loading: false,
  orders: [],
  order: null,
  orderTemplates: [],
  orderTemplate: null,
  activate:null,
  deactivate:null,
  YoursOrders:[],
  orderAdminID:null,
  paginationProps:{},
  addNewOrder:[]
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    
    getOrderTemplates: (state, { payload }) => {
      state.orderTemplates = payload;
    },
    getOrders: (state, { payload }) => {
      state.orders = payload;
    },
    setOrderLoading: (state, { payload }) => {
      state.loading = payload;
    },
    getAllOrders: (state, { payload }) => {
      state.allOrders = payload;
    },
    getOrder: (state, { payload }) => {
      state.order = payload;
    },
    getOrderTemplate: (state, { payload }) => {
      state.orderTemplate = payload;
    },
    getOrderAdminID: (state, { payload }) => {
      state.orderAdminID = payload;
    },
    activateAdmin: (state, { payload }) => {
      state.activate = payload;
    },
    deactivateAdmin: (state, { payload }) => {
      state.deactivate = payload;
    },
    YourOrdersDispatch: (state, { payload }) => {
      state.YoursOrders = payload;
    },
    YoursOrderPaginationProps: (state, { payload }) => {
      state.paginationProps = payload;
    },
    addNewOrder: (state, { payload }) => {
      state.addNewOrder = payload;
    },    
  },
});

const { reducer, actions } = ordersSlice;
export const {
  getOrders,
  getOrder,
  setOrderLoading,
  getOrderTemplate,
  getOrderTemplates,
  getAllOrders,
  activateAdmin,
  deactivateAdmin,
  YoursOrderPaginationProps,
  YourOrdersDispatch,
  getOrderAdminID,
  addNewOrder
} = actions;

export default reducer;
