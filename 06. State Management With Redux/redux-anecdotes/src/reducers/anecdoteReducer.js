import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
    name: "anecdotes",
    initialState: [],
    reducers: {
        voteAnecdote(state, action) {
            const votedAnecdote = action.payload;
            const id = action.payload.id;
            return state.map(anecdote => anecdote.id !== id ? anecdote : votedAnecdote);
        },
        appendAnecdote(state, action) {
            state.push(action.payload);
        },
        setAnecdotes(state, action) {
            return action.payload;
        }
    }
});

export const { voteAnecdote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll();
        dispatch(setAnecdotes(anecdotes));
    };
};

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content);
        dispatch(appendAnecdote(newAnecdote));
    };
};

export const voteAnecdotes = id => {
    return async dispatch => {
        const votedAnecdote = await anecdoteService.vote(id);
        dispatch(voteAnecdote(votedAnecdote));
    };
};

export default anecdoteSlice.reducer;
