const noteReducer = (state = [], action) => {
    if (action.type === "NEW_NOTE") {
        return state.concat(action.data);
    }

    return state;
};

export default noteReducer;
