import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { hideNotification, voteNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>Vote</button>
            </div>
        </div>
    );
};

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes);
    const dispatch = useDispatch();

    const vote = (id) => {
        dispatch(voteAnecdote(id));
        const anecdote = anecdotes.find(a => a.id === id);
        dispatch(voteNotification(anecdote));
        setTimeout(() => dispatch(hideNotification()), 5000);
    };

    return (
        <div>
            {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
                <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => vote(anecdote.id)} />
            )}
        </div>
    );
};

export default AnecdoteList;
