import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    notifications: []
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        getNotifications: (state, { payload }) => {
            state.notifications = payload;
        },
        setNotificationLoading: (state, { payload }) => {
            state.loading = payload;
        }
    }
})

const { reducer, actions } = notificationsSlice;
export const { getNotifications, setNotificationLoading } = actions;

export default reducer;