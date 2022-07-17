# connect
- We have been using our redux-store with help of `hook`-api from `react-redux`.
- This means using `useSelector` and `useDispatch` functions.
- We will look into another older and more complicated way to use redux.
    - The `connect` function provided by `react-redux`.
- **In new apps, use the hook-api**.
    - Knowing how to use connect is useful for maintaining older projects using redux.


## Using The connect-function To Share The Redux Store To Components
- Modify `Notes` component to use `connect` function instead of `useDispatch` and `useSelector`.
- The original is below:
```js
import { useDispatch, useSelector } from "react-redux";
import { toggleImportanceOf } from "../reducers/noteReducer";

// ...

const Notes = () => {
    const dispatch = useDispatch();
    const notes = useSelector(({ filter, notes }) => {
        if (filter === "ALL") {
            return notes;
        }
        return filter === "IMPORTANT"
            ? notes.filter(note => note.important)
            : notes.filter(note => !note.important);
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

export default Notes;
```
- The `connect` function can be used for transforming "regular" React components.
    - The state of the Redux store can be "mapped" into component's props.
- Transform `Notes` component into a `connected component` using `connect` function:
```js
import { connect } from "react-redux";
import { toggleImportanceOf } from "../reducers/noteReducer";

const Notes = () => {
    // ...
};

const ConnectedNotes = connect()(Notes);
export default ConnectedNotes;
```
- The module exports `connected component` which works like the previous regular component for now.
- Component needs list of notes and value of filter from store.
    - The `connect` function takes a `mapStateToProps` function as its first parameter.
    - Function is used to define props of the `connected component` based off the state of Redux store.
- Define:
```js
const Notes = (props) => {
    const dispatch = useDispatch();

    const notesToShow = () => {
        if (props.filter === "ALL") {
            return props.notes;
        }
        return props.filter === "IMPORTANT"
            ? props.notes.filter(note => note.important)
            : props.notes.filter(note => !note.important);
    });

    return (
        <ul>
            {notesToShow().map(note =>
                <Note
                    key={note.id}
                    note={note}
                    handleClick={() => dispatch(toggleImportanceOf(note.id))}
                />
            )}
        </ul>
    );
};

const ConnectedNotes = connect(mapStateToProps)(Notes);
export default ConnectedNotes;
```
- `Notes` component can access state of store directly.
    - Done with `props.notes` that contains list of notes.
    - Can use `props.filter` the references value of filter.
- The `Notes` component does not need info about which filter is selected.
    - Move filtering logic elsewhere.
    - We just have to give it correctly filtered notes in the `notes` prop:
```js
const Notes = (props) => {
    const dispatch = useDispatch();

    return (
        <ul>
            {props.notes.map(note =>
                <Note
                    key={note.id}
                    note={note}
                    handleClick={() => dispatch(toggleImportanceOf(note.id))}
                />
            )}
        </ul>
    );
};

const mapStateToProps = (state) => {
    if (state.ilter === "ALL") {
        return {
            notes: state.notes
        };
    }
    return (state.filter === "IMPORTANT"
        ? state.notes.filter(note => note.important)
        : state.notes.filter(note => !note.important);
    );
}

const ConnectedNotes = connect(mapStateToProps)(Notes);
export default ConnectedNotes;
```

