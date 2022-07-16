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


## Asynchronous Actions And Redux Thunk
- Not good that communication with server happens inside functions of components.
- Better if communication is abstracted away from components.
    - They should do nothing else but call the appropriate `action creator`.
- The `App` would initialize the state of app like:
```js
const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeNotes());
    }, [dispatch]);
};
```
- The `NewNote` would create new note like:
```js
const NewNote = () => {
    const dispatch = useDispatch();

    const addNote = async (event) => {
        event.preventDefault();
        const content = event.target.note.value;
        event.target.note.value = "";
        dispatch(createNote(content));
    };

    // ...
};
```
- Both components dispatch action without the need to know about communication between server that happens behind the scenes.
- These async actions can be done with `Redux Thunk` library.
- Doesn't need additional config when Redux store is created using `configureStore` function.
- Install library:
```
$ npm install redux-thunk
```
- With Redux Thunk, we can implement `action creators` that return a function instead of an object.
    - Function receives Redux store's `dispatch` and `getState` methods as parameters.
    - Allows for example implementations of async action creators.
    - They first wait for completion of a certain async operation and after that dispatch some action that changes the store's state.
- Can define an action creator `initializeNotes` that initializes notes based on data received from server:
```js
// ...
import noteService from "../services/notes";

const noteSlice = createSlice(/* ... */);

export const { createNote, toggleImportanceOf, setNotes, appendNote } = noteSlice.actions;

export const initializeNotes = () => {
    return async dispatch => {
        const notes = await noteService.getAll();
        dispatch(setNotes(notes));
    };
};
```
- The inner function is an `asynchronous action`.
- Operation first fetches all notes from the server.
- It then dispatches the `setNotes` action which adds then to the store.
- The `App` component is now:
```js
// ...
import { initializeNotes } from "./reducers/noteReducer";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeNotes());
    }, [dispatch]);

    return (
        <div>
            <NewNote />
            <VisibilityFilter />
            <Notes />
        </div>
    );
};
```
- Solution is much better.
- Initialization logic for notes has been separated from React component.
- Replace `createNote` action creator created by by `createSlice` function with async action creator.
```js
// ...
import noteService from "../services/notes";

const noteSlice = createSlice({
    name: "notes",
    initialState: [],
    reducers: {
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

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions;

export const initializeNotes = () => {
    return async dispatch => {
        const newNote = await noteService.createNew(content);
        dispatch(appendNote(newNote));
    };
};

export default noteSlice.reducer;
```
- Principle is the same.
    - First, async operation is executed.
    - The action changing the state of the store is `dispatched`.
    - Redux Toolkit offers tools to simplify asynchronous state management.
        - Suitable tools like `createAsyncThunk` and `RTK Query` API.
- The `NewNote` is changed:
```js
// ...
import { createNote } from "../reducers/noteReducer";

const NewNote = () => {
    const dispatch = useDispatch();

    const addNote = async (event) => {
        event.preventDefault();
        const content = event.target.note.value;
        event.target.note.value = "";
        dispatch(createNote(content));
    };

    return (
        <form onSubmit={addNote}>
            <input name="note" />
            <button type="submit">Add</button>
        </form>
    );
};
```
- Clean up `index.js`.
- Move code related to creation of Redux store to its own `store.js` file:
```js
import { configureStore } from "@reduxjs/toolkit";

import noteReducer from "./reducers/noteReducer";
import filterReducer from "./reducers/filterReducer";

const store = configureStore({
    reducer: {
        notes: noteReducer,
        filter: filterReducer
    }
});

export default store;
```
- The contents of `index.js` is now:
```js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);
```

