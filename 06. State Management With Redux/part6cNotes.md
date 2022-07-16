# Communicating With Server In A Redux Application
- Expand app so notes are stored to backend.
- We will use `json-server` again.
- Initial state stored in `db.json`.
    - Placed in root of project.
```json
{
    "notes": [
        {
            "content": "The app state is in redux store",
            "important": true,
            "id": 1
        },
        {
            "content": "State changes are made with actions",
            "important": false,
            "id": 2
        }
    ]
}
```
- Install json-server for project:
```
$ npm install json-server --save-dev
```
- Add the script to `package.json`:
```json
"scripts": {
    "server": "json-server -p3001 --watch db.json",
    // ...
}
```
- Launch `json-server` with `npm run server`.
- Create method into the file `services/notes.js`.
    - Uses `axios` to fetch data from the backend.
```js
import axios from "axios";

const baseUrl = "http://localhost:3001/notes";

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

export default { getAll };
```
- Add `axios` to project:
```
$ npm install axios
```
- Change initialization of state in `noteReducer`.
    - By default, there are no notes.
```js
const noteSlice = createSlice({
    name: "notes",
    initialState: [],
    // ...
});
```
- Add new action `appendNote` for adding a note object:
```js
const noteSlice = createSlice({
    name: "notes",
    initialState: [],
    reducers: {
        createNote(state, action) {
            const content = action.payload;
            state.push({
                content,
                important: false,
                id: generateId()
            });
        },
        toggleImportanceOf(state, action) {
            const id = action.payload;
            const noteToChange = state.find(n => n.id === id);
            const changedNote = {
                ...noteToChange,
                important: !noteToChange.important
            };
            return state.map(note => note.id !== id ? note : changedNote);
        },
        appendNote(state, action) {
            state.push(action.payload);
        }
    }
});

export const { createNote, toggleImportanceOf, appendNote } = noteSlice.actions;
export default noteSlice.reducer;
```
- Quick way to initialize notes state based on data received from server is to fetch notes in `index.js`.
    - Dispatch action using `appendNote` action creator for each note.
```js
// ...
import noteService from "./services/notes";
import noteReducer, { appendNote } from "./reducers/noteReducer";

const store = configureStore({
    reducer: {
        notes: noteReducer,
        filter: filterReducer
    }
});

noteService.getAll().then(notes =>
    notes.forEach(note => {
        store.dispatch(appendNote(note));
    });
);
```
- Dispatching multiple items is impractical.
- Add an action creator `setNotes` to directly replace the notes array.
- Get action creator from `createSlice` function by implementing the `setNotes` action:
```js
// ...

const noteSlice = createSlice({
    name: "notes",
    initialState: [],
    reducers: {
        createNote(state, action) {
            const content = action.payload;
            state.push({
                content,
                important: false,
                id: generateId()
            });
        },
        toggleImportanceOf(state, action) {
            const id = action.payload;
            const noteToChange = state.find(n => n.id === id);
            const changedNote = {
                ...noteToChange,
                important: !noteToChange.important
            };
            return state.map(note => note.id !== id ? note : changedNote);
        },
        appendNote(state, action) {
            state.push(action.payload);
        },
        setNotes(state, action) {
            return action.payload;
        }
    }
});

export const { createNote, toggleImportanceOf, appendNote, setNotes } = noteSlice.actions;
export default noteSlice.reducer;
```
- Code in `index.js` looks better:
```js
// ...
import noteService from "./services/notes";
import noteReducer, { setNotes } from "./reducers/noteReducer";

const store = configureStore({
    reducer: {
        notes: noteReducer,
        filter: filterReducer
    }
});

noteService.getAll().then(notes =>
    store.dispatch(setNotes(notes));
);
```
- We do not use `async/await` syntax.
    - The `await` keyword only works inside `async` functions.
    - Code in `index.js` is not inside a function.
- We move initialization of notes into `App`.
    - When fetching data from server, we use the `effect hook`.
```js
import { useEffect } from "react";
import NewNote from "./components/NewNote";
import Notes from "./components/Notes";
import VisibilityFilter from "./components/VisibilityFilter";
import noteService from "./services/notes";
import { setNotes } from "./reducers/noteReducer";
import { useDispatch } from "react-redux";

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        noteService
            .getAll().then(notes => dispatch(setNotes(notes)));
    }, []);

    return (
        <div>
            <NewNote />
            <VisibilityFilter />
            <Notes />
        </div>
    );
};

export default App;
```
- The `useEffect` hook causes ESlint warning.
- Rid it by doing:
```js
const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        noteService
            .getAll().then(notes => dispatch(setNotes(notes)));
    }, [dispatch]);

    // ...
};
```
- If the value of `dispatch` changes during runtime, the effect would be executed again.
- This cannot happen in our app, so the warning is unnecessary.
- Another way to rid is to disable eslint on that line:
```js
const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        noteService
            .getAll().then(notes => dispatch(setNotes(notes)));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ...
};
```
- Just use the first solution.
- Do the same when it comes to creating new note.
    - Expand code communicating with server:
```js
const baseUrl = "http://localhost:3001/notes";

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const createNew = async (content) => {
    const object = { content, important: false };
    const response = await axios.post(baseUrl, object);
    return response.data;
};

export default {
    getAll,
    createNew
};
```
- The `addNote` function of `NewNote` component changes:
```js
import { useDispatch } from "react-redux";
import { createNote } from "../reducers/noteReducer";
import noteService from "../services/notes";

const NewNote = (props) => {
    const dispatch = useDispatch();

    const addNote = async (event) => {
        event.preventDefault();
        const content = event.target.note.value;
        event.target.note.value = "";
        const newNote = await noteService.createNew(content);
        dispatch(createNote(newNote));
    };

    return (
        <form onSubmit={addNote}>
            <input name="note" />
            <button type="submit">Add</button>
        </form>
    );
};

export default NewNote;
```
- Backend generates ids for notes.
- Change action creator `createNote`:
```js
createNote(state, action) {
    state.push(action.payload);
}
```


