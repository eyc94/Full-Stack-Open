import React, { useState } from "react";
import Note from "./components/Note";

const App = (props) => {
    const [notes, setNotes] = useState(props.notes);
    const [newNote, setNewNote] = useState(
        "a new note..."
    );

    const addNote = (event) => {
        event.preventDefault();
        console.log("Button Clicked", event.target);
    };

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>
            <form onClick={addNote}>
                <input value={newNote} />
                <button type="submit">save</button>
            </form>
        </div>
    );
};

export default App;
