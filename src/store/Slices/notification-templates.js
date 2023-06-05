import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  templates: [],
  template: null,
  loading: false,
};
const notificationTemplatesSlice = createSlice({
  name: 'notificationTemplates',
  initialState,
  reducers: {
    getNotifications: (state, { payload }) => {
      state.notifications = payload;
    },
    getTemplates: (state, { payload }) => {
      state.templates = payload;
    },
    getTemplate: (state, { payload }) => {
      state.template = payload;
    },
    setNTLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = notificationTemplatesSlice;

export const { getNotifications, getTemplates, getTemplate, setNTLoading } =
  actions;
export default reducer;
