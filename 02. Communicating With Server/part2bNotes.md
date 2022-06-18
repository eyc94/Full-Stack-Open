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


## Controlled Component
- Many ways to access form's `input` element.
- First way is through `controlled components`.
- Add new piece of state called `newNote`.
    - Store user-submitted input.
    - Set as `input` element's `value` attribute.
```javascript
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
            <form onSubmit={addNote}>
                <input value={newNote} />
                <button type="submit">save</button>
            </form>
        </div>
    );
};
```
- It sets a placeholder text for the `input` element.
- The value of this placeholder is the value of `newNote`.
    - Notice how you cannot change this value.
    - Console gives a hint as to why.
- To enable editing of this `input` element, register an event handler.
    - This synchronizes changes made to the input with the component's state.
```javascript
const App = (props) => {
    const [notes, setNotes] = useState(props.notes);
    const [newNote, setNewNote] = useState(
        "a new note..."
    );

    // ...

    const handleNoteChange = (event) => {
        console.log(event.target.value);
        setNewNote(event.target.value);
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
                <input
                    value={newNote}
                    onChange={handleNoteChange}
                />
                <button type="submit">save</button>
            </form>
        </div>
    );
};
```
- An event handler is registered to the `onChange` attribute of the `input` element.
    - Every time a change happens in the `input` element, the event handler is called.
    - Event handler receives event object as its `event` parameter.
- The `target` property refers to the controlled `input` element.
- The `event.target.value` refers to the value of that element.
- We did not need `event.preventDefault()` because there is no default action in input change.
- The `App` component's `newNote` state reflects value in `input` element.
    - Use this value to complete `addNote` function.
```javascript
const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
        content: newNote,
        date: new Date().toISOString(),
        important: Math.random() < 0.5,
        id: notes.length + 1
    };

    setNotes(notes.concat(noteObject));
    setNewNote("");
};
```
- Create new note object called `noteObject`.
    - Contents received from `newNote` state.
    - The `id` is made based on the current total notes.
    - The `important` property has a 50% chance of being true or false.
- New note added to list of `notes` using `concat()` method.
    - This creates a new copy of the original `notes` array with the new item added at the end.
- Event handler also resets value of controlled input element.


