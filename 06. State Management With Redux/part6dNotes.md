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


## Alternative Way Of Using mapDispatchToProps
- Defined function for dispatching acionts from `NewNote` like:
```js
const NewNote = () => {
    // ...
};

export default connect(
    null,
    { createNote }
)(NewNote);
```
- The connect expression allows component to dispatch actions to create new note.
- The functions passed in `mapDispatchToProps` must be `action creators`.
    - Functions that return Redux actions.
- Worth noting that `mapDispatchToProps` parameter is a JS object:
```js
{
    createNote
}
```
- The above is shorthand for:
```js
{
    createNote: createNote
}
```
- Alternatively, we can pass the following function as the second parameter to `connect`:
```js
const NewNote = (props) => {
    // ...
};

const mapDispatchToProps = dispatch => {
    return {
        createNote: value => {
            dispatch(createNote(value));
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(NewNote);
```
- The `mapDispatchToProps` is a function that `connect` will call by passing it the `dispatch` function as its parameter.
- Return value is an object defining a group of functions that get passed to the connected component as props.
- Example defines the function passed as the `createNote` prop.
    - Just dispatches the action created with the `createNote` action creator.
- Component then references the function through its props by calling `props.createNote`:
```js
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
```
- Efficient to use the simpler form of `mapDispatchToProps`.
- There are situations where the more complex definition is necessary.
    - If the dispatched actions need to reference the props of the component.


## Presentational/Container Revisited
- The refactored `Notes` component is entirely focused on rendering notes and is close to being called `presentational component`.
- According to Dan Abramov, presentation components:
    - Are concerned with how things look.
    - May contain both presentational and container components inside. They usually have some DOM markup and styles of their own.
    - Often allow containment via props.children.
    - Have no dependencies on the rest of the app, such as Redux actions or stores.
    - Don't specify how the data is loaded or mutated.
    - Receive data and callbacks exclusively via props.
    - Rarely have their own state (when they do, it's UI state rather than data).
    - Are written as functional components unless they need state, lifecycle hooks, or performance optimizations.
- The connected component is a `container` component.
- According to Dan Abramov, container components:
    - Are concerned with how things work.
    - May contain both presentational and container components inside but usually don't have any DOM markup of their own except for some wrapping divs, and never have any styles.
    - Provide the data and behavior to presentational or other container components.
    - Call Redux actions and provide these as callbacks to the presentational components.
    - Are often stateful, as they tend to serve as data sources.
    - Are usually generated using higher order components such as connect from React Redux, rather than written by hand.
- Dividing presentational and container components is a good way of structuring React apps.
- The benefits of division according to Dan:
    - Better separation of concerns. You understand your app and your UI better by writing components this way.
    - Better reusability. You can use the same presentational component with completely different state sources, and turn those into separate container components that can be further reused.
    - Presentational components are essentially your app's "palette". You can put them on a single page and let the designer tweak all their variations without touching the app's logic. You can run screenshot regression tests on that page.
- There is a mention of `high order component`.
    - `Notes` component is regular component.
    - The `connect` method is a `high order component`.
    - A high order component is a function that takes a "regular" component as its parameter.
    - It returns a new "regular" component as its return value.
- They are a way of defining generic functionality that can be applied to components.
- HOCs are generalizations of HOFs.
- After React hook-api was published, HOCs are less popular.


## Redux and the Component State
- We are using React the "right" way.
    - React should focus on generating views.
    - The app state is separated from this and passed to Redux, its actions, and its reducers.
- You have to decide when it's better to use the `useState` hook or Redux.

