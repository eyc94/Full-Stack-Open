import { useState } from "react";

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState("");

    const handleChange = (event) => {
        setNewNote(event.target.value);
    };

    const addNote = (event) => {
        event.preventDefault();
        createNote({
            content: newNote,
            important: Math.random() > 0.5
        });

        setNewNote("");
    };

    return (
        <div>
            <h2>Create A New Note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default NoteForm;