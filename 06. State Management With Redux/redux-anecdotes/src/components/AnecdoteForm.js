import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification, hideNotification } from "../reducers/notificationReducer";

import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const addAnecdote = async (event) => {
        event.preventDefault();
        const content = event.target.anecdote.value;
        event.target.anecdote.value = "";
        const newAnecdote = await anecdoteService.createNew(content);
        dispatch(createAnecdote(newAnecdote));
        dispatch(setNotification(content));
        setTimeout(() => dispatch(hideNotification()), 5000);
    };

    return (
        <div>
            <h2>Create New</h2>
            <form onSubmit={addAnecdote}>
                <div><input name="anecdote" /></div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default AnecdoteForm;