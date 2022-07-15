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
        },
        voteNotification(state, action) {
            return `You voted ${action.payload.content}`;
        }
    }
});

export const { setNotification, hideNotification, voteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
