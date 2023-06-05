import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userGroups: [],
  groupPermissions: [],
  loading: false,
  group: null,
};
const userGroupsSlice = createSlice({
  name: 'userGroups',
  initialState,
  reducers: {
    getUserGroups: (state, { payload }) => {
      state.userGroups = payload;
    },
    setUserGroupsLoading: (state, { payload }) => {
      state.loading = payload;
    },
    getGroupPermissions: (state, { payload }) => {
      state.groupPermissions = payload;
    },
    getGroup: (state, { payload }) => {
      state.group = payload;
    },
    clearGroup: (state) => {
      state.groupPermissions = [];
      state.group = null;
    },
  },
});

const { reducer, actions } = userGroupsSlice;
export const {
  getUserGroups,
  setUserGroupsLoading,
  getGroupPermissions,
  clearGroup,
  getGroup,
} = actions;

export default reducer;
