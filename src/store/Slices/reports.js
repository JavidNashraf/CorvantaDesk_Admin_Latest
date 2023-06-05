// getAllProducts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredReports: [],
  replyReports: {},
  responseReports: [],
  reportsByCustomer: [],
  reportsByAgent: [],
  reportsByStatus: [],
  reportsByDepartment: [],
  reportsByPriority: [],
  reportsDownload: [],
  loading: false,
  annualReports: [],
  responceTime: {},
  ticketDuration: {},
  replyReport: {},
};


const productsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {

    getFilteredReportsDispatch: (state, { payload }) => {
      state.filteredReports = payload;
    },
    getReplyReportsDispatch: (state, { payload }) => {
      const { type, data } = payload
      state.replyReports = { ...state.replyReports, [type]: data };
    },
    getResponseReportsDispatch: (state, { payload }) => {
      state.responseReports = payload;
    },
    getReportsByCustomerDispatch: (state, { payload }) => {
      state.reportsByCustomer = payload;
    },
    getReportsByAgentDispatch: (state, { payload }) => {
      state.reportsByAgent = payload;
    },
    getReportsByStatusDispatch: (state, { payload }) => {
      state.reportsByStatus = payload;
    },
    getReportsByDepartmentDispatch: (state, { payload }) => {
      state.reportsByDepartment = payload;
    },
    getReportsByPriorityDispatch: (state, { payload }) => {
      state.reportsByPriority = payload;
    },
    setReportsLoading: (state, { payload }) => {
      state.loading = payload;
    },
    getReportsDownload: (state, { payload }) => {
      state.reportsDownload = payload;
    },
    getAnnualReportsDispatch: (state, { payload }) => {
      state.annualReports = payload;
    },
    responceTimeDispatch: (state, { payload }) => {
      const { type, data } = payload
      state.responceTime = { ...state.responceTime, [type]: data };
    },
    ticketDurationDispatch: (state, { payload }) => {
      const { type, data } = payload
      state.ticketDuration = { ...state.ticketDuration, [type]: data };
    },
    replyReportDispatch: (state, { payload }) => {
      const { type, data } = payload
      state.replyReport = { ...state.replyReport, [type]: data };
    },
  },
});

const { reducer, actions } = productsSlice;
export const {
  getAnnualReportsDispatch,
  responceTimeDispatch,
  ticketDurationDispatch,
  replyReportDispatch,
  getFilteredReportsDispatch,
  getReplyReportsDispatch,
  getResponseReportsDispatch,
  getReportsDownload,
  setReportsLoading,

  // Filter Reports
  getReportsByAgentDispatch,
  getReportsByCustomerDispatch,
  getReportsByStatusDispatch,
  getReportsByDepartmentDispatch,
  getReportsByPriorityDispatch,

} = actions;

export default reducer;
