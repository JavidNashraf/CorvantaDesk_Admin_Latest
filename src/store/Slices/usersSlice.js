import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  onlineUsers: [],
  user: {
    creditBalance: 0,
  },
  clients: [],
  userSettings: null,
  loading: false,
  userModules: [],
  specificUsers: [],
};
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUsers: (state, { payload }) => {
      state.users = payload;
    },
    getOnlineUsers: (state, { payload }) => {
      state.onlineUsers = payload;
    },
    getClients: (state, { payload }) => {
      state.clients = payload;
    },
    getUser: (state, { payload }) => {
      state.user = {
        ...state.user,
        ...payload,
      }
    },
    getCreditBalance: (state, { payload }) => {
      state.user = {
        ...state.user,
        creditBalance: payload,
      }
    },
    getUserSettingsSlice: (state, { payload }) => {
      state.userSettings = payload;
    },
    setUserLoading: (state, { payload }) => {
      state.loading = payload;
    },
    getUserModule: (state, { payload }) => {
      state.userModules = payload;
    },
    getSpecificUsersDispatch: (state, { payload }) => {
      state.specificUsers = payload;
    },
  },
});

const { reducer, actions } = usersSlice;
export const {
  getUser,
  getUsers,
  getClients,
  setUserLoading,
  getUserModule,
  getUserSettingsSlice,
  getSpecificUsersDispatch,
  getOnlineUsers,
  getCreditBalance,
} = actions;

export default reducer;
