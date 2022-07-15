import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification(state, action) {
            return action.payload;
        },
        hideNotification(state, action) {
            return initialState;
        }
    }
});

export const { setNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
