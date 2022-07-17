import { connect } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = (props) => {
    const addAnecdote = async (event) => {
        event.preventDefault();
        const content = event.target.anecdote.value;
        event.target.anecdote.value = "";
        props.createAnecdote(content);
        props.setNotification(`You Added: ${content}`, 5000);
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

const mapDispatchToProps = {
    createAnecdote,
    setNotification
};

export default connect(
    null,
    mapDispatchToProps
)(AnecdoteForm);
