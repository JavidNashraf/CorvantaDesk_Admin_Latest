import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emailTemplates: [],
  emailTemplate: null,
  loading: false,
};
const emailTemplatesSlice = createSlice({
  name: 'emailTemplates',
  initialState,
  reducers: {
    getEmailTemplates: (state, { payload }) => {
      state.emailTemplates = payload;
    },
    getEmailTemplate: (state, { payload }) => {
      state.emailTemplate = payload;
    },
    setEmailTemplatesLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

const { reducer, actions } = emailTemplatesSlice;

export const { getEmailTemplates, getEmailTemplate, setEmailTemplatesLoading } =
  actions;
export default reducer;
