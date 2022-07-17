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


## mapDispatchToProps
- We got rid of `useSelector`.
- However, `Notes` still uses `useDispatch` hook and `dispatch` function returning it.
- Second parameter of `connect` can be used to define `mapDispatchToProps`.
    - Group of `action creator` functions passed to the connected component as props.
    - Make the following changes to our existing connect operation:
```js
const mapStateToProps = (state) => {
    return {
        notes: state.notes,
        filter: state.filter
    };
};

const mapDispatchToProps = {
    toggleImportanceOf
};

const ConnectedNotes = connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);

export default ConnectedNotes;
```
- Component can now directly dispatch action defined by `toggleImportanceOf` action creator.
    - Done by calling function through its props.
```js
const Notes = (props) => {
    return (
        <ul>
            {props.notes.map(note =>
                <Note
                    key={note.id}
                    note={note}
                    handleClick={() => props.toggleImportanceOf(note.id)}
                />
            )}
        </ul>
    );
};
```
- No need to call `dispatch` function separately.
    - The `connect` function already modified the `toggleImportanceOf` action creator into a form that contains the dispatch.
- Component also now references a function that can be used for dispatching `notes/toggleImportanceOf` type actions.
    - Done with its prop.
- Code for `Notes` is now:
```js
import { connect } from "react-redux";
import { toggleImportanceOf } from "../reducers/noteReducer";

const Notes = (props) => {
    return (
        <ul>
            {props.notes.map(note =>
                <Note
                    key={note.id}
                    note={note}
                    handleClick={() => props.toggleImportanceOf(note.id)}
                />
            )}
        </ul>
    );
};

const mapStateToProps = (state) => {
    if (state.filter === "ALL") {
        return {
            notes: state.notes
        };
    }

    return {
        notes: (state.filter === "IMPORTANT"
        ? state.notes.filter(note => note.important)
        : state.notes.filter(note => !note.important);
        )
    };
};

const mapDispatchToProps = {
    toggleImportanceOf
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);
```
- Use `connect` to create new notes:
```js
import { connect } from "react-redux";
import { createNote } from "../reducers/noteReducer";

const NewNote = (props) => {
    const addNote = (event) => {
        event.preventDefault();
        const content = event.target.note.value;
        event.target.note.value = "";
        props.createNote(content);
    };

    return (
        <form onSubmit={addNote}>
            <input name="note" />
            <button type="submit">Add</button>
        </form>
    );
};

export default connect(
    null,
    { createNote }
)(NewNote);
```
- Component does not need to access store's state.
    - Just pass `null` as the first parameter to `connect`.


## Referencing Action Creators Passed As props
- Direct attention to one interesting detail in `NewNote` component:
```js
import { connect } from "react-redux";
import { createNote } from "../reducers/noteReducer";

const NewNote = (props) => {
    const addNote = (event) => {
        event.preventDefault();
        const content = event.target.note.value;
        event.target.note.value = "";
        props.createNote(content);
    };

    return (
        <form onSubmit={addNote}>
            <input name="note" />
            <button type="submit">Add</button>
        </form>
    );
};

export default connect(
    null,
    { createNote }
)(NewNote);
```
- Notice there are two versions of `createNote` action creator in the component.
- Function must be referenced as `props.createNote` through the component's props.
    - This is the version that contains automatic `dispatch` added by `connect`.
- Can also just directly reference the action creator by calling `createNote` directly.
    - Don't do this.
    - This is the unmodified version of the action creator.
    - Does not have added automatic dispatch.
- If you print both to the console, we see the differences between the two functions.
- When you call `createNote` directly, this is a regular `action creator` function.
- The `props.createNote` contains the additional dispatch to the store that was added by connect.


