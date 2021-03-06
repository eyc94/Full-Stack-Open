import { useSelector, useDispatch } from "react-redux";
import { voteAnecdotes } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

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
    const anecdotes = useSelector(state => {
        if (state.filter === "") {
            return state.anecdotes;
        } else {
            return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()));
        }
    });
    const dispatch = useDispatch();

    const vote = (id) => {
        dispatch(voteAnecdotes(id));
        const anecdote = anecdotes.find(a => a.id === id);
        dispatch(setNotification(`You Voted: ${anecdote.content}`, 5000));
    };

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => vote(anecdote.id)} />
            )}
        </div>
    );
};

export default AnecdoteList;
