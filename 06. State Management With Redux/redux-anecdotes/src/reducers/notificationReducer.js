import { createSlice } from "@reduxjs/toolkit";

const initialState = "";
let timeoutID;

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification(state, action) {
            return action.payload;
        },
        hideNotification(state, action) {
            return initialState;
        },
        voteNotification(state, action) {
            return `You Voted: ${action.payload.content}`;
        }
    }
});

export const { addNotification, hideNotification, voteNotification } = notificationSlice.actions;

export const setNotification = (message, seconds) => {
    return dispatch => {
        clearTimeout(timeoutID);
        dispatch(addNotification(message));
        timeoutID = setTimeout(() => dispatch(hideNotification()), seconds);
    };
};

export default notificationSlice.reducer;
