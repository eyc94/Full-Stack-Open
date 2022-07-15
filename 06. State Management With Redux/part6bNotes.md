# Many Reducers
- Continue with notes application.
- Change reducer so that store gets initialized with a state that contains a couple of notes:
```js
const initialState = [
    {
        content: "Reducer defines how redux store works",
        important: true,
        id: 1
    },
    {
        content: "State of store can contain any data",
        important: false,
        id: 2
    }
];

const noteReducer = (state = initialState, action) => {
    // ...
};

// ...

export default noteReducer;
```


## Store With Complex State
- Implement filtering of notes displayed to user.
- Use `radio buttons`.
- Start very simple and straightforward:
```js
import NewNote from "./components/NewNote";
import Notes from "./components/Notes";

const App = () => {
    const filterSelected = (value) => {
        console.log(value);
    };

    return (
        <div>
            <NewNote />
            <div>
                all <input type="radio" name="filter" onChange={() => filterSelected("ALL")} />
                important <input type="radio" name="filter" onChange={() => filterSelected("IMPORTANT")} />
                nonimportant <input type="radio" name="filter" onChange={() => filterSelected("NONIMPORTANT")} />
            </div>
            <Notes />
        </div>
    );
};
```
- The `name` attribute makes the radio buttons a `button group`.
    - Only one button is clicked at a time.
- The `onChange` only prints value associated with the filter.
- Implement filter by storing value of filter in redux store in addition to notes themselves.
- State of store should look like:
```js
{
    notes: [
        { content: "Reducer defines how redux store works", important: true, id: 1 },
        { content: "State of store can contain any data", important: false, id: 2 }
    ],
    filter: "IMPORTANT"
}
```


## Combined Reducers
- Modify current reducer to deal with new shape of state.
- Better situation is to define a new separate reducer for the state of the filter:
```js
const filterReducer = (state = "ALL", action) => {
    switch (action.type) {
        case "SET_FILTER":
            return action.filter;
        default:
            return state;
    };
};
```
- Actions for changing state of the filter look like:
```js
{
    type: "SET_FILTER",
    filter: "IMPORTANT"
}
```
- Create new action creator function.
- Write code for new action creator in `src/reducers/filterReducer.js`:
```js
const filterReducer = (state = "ALL", action) => {
    // ...
};

export const filterChange = filter => {
    return {
        type: "SET_FILTER",
        filter
    };
};

export default filterReducer;
```
- Can create the actual reducer for our app by combining two existing reducers.
    - Use `combineReducers` function.
    - Define in `index.js`:
```js
import React from "react";
import ReactDOM from "react-dom/client";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import App from "./App";

import noteReducer from "./reducers/noteReducer";
import filterReducer from "./reducers/filterReducer";

const reducer = combineReducers({
    notes: noteReducer,
    filter: filterReducer
});

const store = createStore(reducer);

console.log(store.getState());

ReactDOM.createRoot(document.getElementById("root")).render(
    /*
    <Provider store={store}>
        <App />
    </Provider>
    */
    <div />
);
```
- App breaks so comment out code and render an empty `div` element.
- State of store gets printed to console.
- State of store defined by reducer above is an object with two properties.
    - The `notes` and `filter`.
    - Value of `notes` is defiend by `noteReducer`.
        - Does not have to deal with other properties of state.
    - The `filter` is managed by `filterReducer`.
- Look at how different actions change the state of the store defined by combined reducer.
- Add the following to `index.js`:
```js
import { createNote } from "./reducers/noteReducer";
import { filterChange } from "./reducers/filterReducer";

// ...

store.subscribe(() => console.log(store.getState()));
store.dispatch(filterChange("IMPORTANT"));
store.dispatch(createNote("combineReducers forms one reducer from many simple reducers"));
```
- Simulating creation of note and changing the state of the filter causes state of store to be logged to console after every change made to store.
- Note if we add console logging to beginning of both reducers:
```js
const filterReducer = (state = "ALL", action) => {
    console.log("ACTION: ", action);
    // ...
};
```
- Gets printed twice.
- Combined reducers work such that every action gets handled in every part of the combined reducer.


## Finishing The Filters
- Finish app to use combined reducer.
- Change rendering of application.
    - Hook up store to app in `index.js`.
```js
ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);
```
- Fix bug because code is expecting an array of notes.
    - The notes are stored in the store's `notes` field.
    - Make slight change to selector function:
```js
const Notes = () => {
    const dispatch = useDispatch();
    const notes = useSelector(notes => state.notes);

    return (
        <ul>
            {notes.map(note =>
                <Note
                    key={note.id}
                    note={note}
                    handleClick={() => dispatch(toggleImportanceOf(note.id))}
                />
            )}
        </ul>
    );
};
```
- Extract visibility filter to its own component at `src/components/VisibilityFilter.js`:
```js
import { filterChange } from "../reducers/filterReducer";
import { useDispatch } from "react-redux";

const VisibilityFilter = (props) => {
    const dispatch = useDispatch();

    return (
        <div>
            all <input type="radio" name="filter" onChange={() => dispatch(filterChange("ALL"))} />
            important <input type="radio" name="filter" onChange={() => dispatch(filterChange("IMPORTANT"))} />
            nonimportant <input type="radio" name="filter" onChange={() => dispatch(filterChange("NONIMPORTANT"))} />
        </div>
    );
};

export default VisibilityFilter;
```
- `App` is now simplifed to:
```js
import Notes from "./components/Notes";
import NewNote from "./components/NewNote";
import VisibilityFilter from "./components/VisibilityFilter";

const App = () => {
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
- Clicking different radio buttons changes the stage of the store's `filter` property.
- Change `Notes` to incorporate filter:
```js
const Notes = () => {
    const dispatch = useDispatch();
    const notes = useSelector(state => {
        if (state.filter === "ALL") {
            return state.notes;
        }

        return state.filter === "IMPORTANT"
            ? state.notes.filter(note => note.important)
            : state.notes.filter(note => !note.important);
    });

    return (
        <ul>
            {notes.map(note =>
                <Note
                    key={note.id}
                    note={note}
                    handleClick={() => dispatch(toggleImportanceOf(note.id))}
                />
            )}
        </ul>
    );
};
```
- Simplify selector by destructuring:
```js
const notes = useSelector(({ filter, notes }) => {
    if (filter === "ALL") {
        return notes;
    }

    return filter === "IMPORTANT"
        ? notes.filter(note => note.important)
        : notes.filter(note => !note.important);
});
```
- There is an issue.
    - Even though filter is set to `ALL` by default.
    - Associated radio button is not selected.
    - Fix this later because it's harmless.


## Redux Toolkit
- Redux's config and management requires a lot of effort.
- This is because of the reducer and action creator related code.
- `Redux Toolkit` is a library that solves these common Redux-related problems.
    - Simplifies configuration of Redux store and offers a large variety of tools to ease state management.
- Install library:
```
$ npm install @reduxjs/toolkit
```
- Open `index.js` which currently creates Redux store.
- Instead of using `createStore` function, we use Redux Toolkit's `configureStore` function:
```js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";

import noteReducer from "./reducers/noteReducer";
import filterReducer from "./reducers/filterReducer";

const store = configureStore({
    reducer: {
        notes: noteReducer,
        filter: filterReducer
    }
});

console.log(store.getState());

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);
```
- We don't need `combineReducers` to create reducer for the store.
- The `configureStore` has many additional benefits.
    - Effortless integration of dev tools and common libraries without need for additional config.
- Refactor the reducers.
- We can easily create reducer and related action creators using `createSlice` function.
- Can use `createSlice` to refactor reducer and action creators in `reducers/noteReducer.js` file:
```js
import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {
        content: "Reducer defines how redux store works",
        important: true,
        id: 1
    },
    {
        content: "State of store can contain any data",
        important: false,
        id: 2
    }
];

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

const noteSlice = createSlice({
    name: "notes",
    initialState,
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
        }
    }
});
```
- The `createSlice` function's `name` parameter defines prefix used in action's type values.
- The `createNote` action later will have the type value of `notes/createNote`.
- Good practice to give parameter a value that is unique among reducers.
    - There won't be collisions between app's action type values.
- The `initialState` parameter defines the reducer's initial state.
- The `reducers` parameter takes the reducer itself as an object.
    - The functions handle state changes caused by certain actions.
- The `action.payload` contains argument provided by calling the action creator:
```js
dispatch(createNote("Redux Toolkit is awesome!"));
```
- The dispatch call above responds to  dispatching the following object:
```js
dispatch({ type: "notes/createNote", payload: "Redux Toolkit is awesome!" });
```
- Notice that `createNote` function violates the immutability principle.
- It uses the `push` method.
- Redux Toolkit uses the `Immer` library with reducers created by `createSlice` function.
    - Makes it ok to mutate `state` inside reducer.
    - `Immer` uses mutated state to produce a new, immutable state.
    - The state thus remains immutable.
    - This comes in handy for complex states.
- The `createSlice` function returns object.
    - Contains reducer and action creators defined by `reducers` parameter.
- The reducer can be accessed by `noteSlice.reducer` property.
- Action creators by the `noteSlice.actions` property.
- Produce the file's exports in this way:
```js
const noteSlice = createSlice(/* ... */);

export const { createNote, toggleImportanceOf } = noteSlice.actions;
export default noteSlice.reducer;
```
- Imports in other files work fine.
- Alter tests a bit due to naming conventions of Redux Toolkit:
```js
import noteReducer from "./noteReducer";
import deepFreeze from "deep-freeze";

describe("noteReducer", () => {
    test("Returns new state with action notes/createNote", () => {
        const state = [];
        const action = {
            type: "notes/createNote",
            payload: "The app state is in redux store"
        };

        deepFreeze(state);
        const newState = noteReducer(state, action);

        expect(newState).toHaveLength(1);
        expect(newState.map(s => s.content)).toContainEqual(action.payload);
    });

    test("Returns new state with action notes/toggleImportanceOf", () => {
        const state = [
            {
                content: "The app state is in redux store",
                important: true,
                id: 1
            },
            {
                content: "State changes are made with actions",
                important: false,
                id: 2
            }
        ];

        const action = {
            type: "notes/toggleImportanceOf",
            payload: 2
        };

        deepFreeze(state);
        const newState = noteReducer(state, action);

        expect(newState).toHaveLength(2);
        expect(newState).toContainEqual(state[0]);
        expect(newState).toContainEqual({
            content: "State changes are made with actions",
            important: true,
            id: 2
        });
    });
});
```


