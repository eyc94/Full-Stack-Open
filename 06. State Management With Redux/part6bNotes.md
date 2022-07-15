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


