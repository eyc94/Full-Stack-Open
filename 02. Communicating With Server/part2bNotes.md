# Forms
- Allow users to add new notes.
- If you want page to update when user notes are added.
    - Store notes in `App` component's state.
    - So, import `useState` function and use it to define a piece of state.
```javascript
import { useState } from "react";
import Note from "./components/Note";

const App = (props) => {
    const [notes, setNotes] = useState(props.notes);

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notesmap(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>
        </div>
    );
};

export default App;
```
- The `notes` has the initial notes array passed to `App`.
- If we want to start with an empty list.
    - Set the start as an empty array `[]`.
    - We can omit `props` because we don't need that for initial state anymore.
```javascript
const App = () => {
    const [notes, setNotes] = useState([]);

    // ...
};
```
- Stick with initial props for now.
- Add an HTML `form` to the component to add new notes.
```javascript
const App = (props) => {
    const [notes, setNotes] = useState(props.notes);

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
            <form onSubmit={addNote}>
                <input />
                <button type="submit">save</button>
            </form>
        </div>
    );
};
```
- The `addNote` function is an event handler to the form element.
    - This is called when form is submitted.
    - Done when submit button is clicked.
- The `event` parameter is the event that triggered the call to the event handler.
    - Event handler calls `event.preventDefault()`.
    - Prevents default action of submitting a form.
        - The default action is page reloading.
- The target of the event is stored in `event.target`.
    - The target is the form defined in the component.
    - How do we access data in the form's `input` element?


