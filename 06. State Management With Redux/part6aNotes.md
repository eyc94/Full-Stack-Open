# Flux-Architecture and Redux
- So far, we did what's recommended.
- We placed all state in the app's root component.
- We then passed state and all handlers down to the components using props.
- Works up to a point and the app just gets larger.
- State management gets more complex.


## Flux-Architecture
- Facebook developed the `Flux` architecture.
    - `https://facebook.github.io/flux/docs/in-depth-overview/`
    - Makes state management easier.
- State separated completely from React components in its own `stores`.
    - State in store is not changed directly.
    - Changed with different `actions`.
- When actions change the state of the store, the `views` are rerendered.
- If an action (like pressing button), changes state, the change is made with an action.
    - Causes rerendering the view.
- Flux offers a way for how and where the app's state is kept and how it is modified.


## Redux
- We will use the `Redux` library.
    - Sample principle as Flux but simpler.
- We will implement a counter application again.
- Create a new `create-react-app` and install redux:
```
$ npm install redux
```
- In Redux the state is stored in a `store`.
- State of app is stored into one JavaScript object in the store.
    - App only needs value of the counter so store straight in the store.
    - If state is more complicated, different things in the state would be saved as separate fields of the object.
- State of store is changed with `actions`.
    - Actions are objects.
    - Have at least one field determining the `type` of action.
    - App needs for example the following action:
```js
{
    type: "INCREMENT"
}
```
- Other fields can be declared as needed.
- Our app is simple so actions are fine with just the type field.
- Impact of action to the state of the app is defined using a `reducer`.
    - Reducer is a function which is given the current state and an action as parameters.
    - Returns a new state.
- Define a reducer for our app:
```js
const counterReducer = (state, action) => {
    if (action.type === "INCREMENT") {
        return state + 1;
    } else if (action.type === "DECREMENT") {
        return state - 1;
    } else if (action.type === "ZERO") {
        return 0;
    }

    return state;
};
```
- First parameter is `state` in store.
- Reducer returns a new state based on actions type.
- Common way is to use `switch` statements and not `if-else` statements.
- Define a default value of 0 for parameter `state`.
    - The reducer will work without having primed the state.
```js
const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        case "ZERO":
            return 0;
        default:    // If none of the above matches, code comes here.
            return state;
    }
};
```
- Reducer never supposed to be called directly from app code.
    - Only given as parameter to `createStore` function which creates the store.
```js
import { createStore } from "redux";

const counterReducer = (state = 0, action) => {
    // ...
};

const store = createStore(counterReducer);
```
- The store now uses the reducer to handle actions.
    - Actions are `dispatched` or sent to the store with the `dispatch` method.
```js
store.dispatch({ type: "INCREMENT" });
```
- Can find the state of the store using `getState`.
- For example:
```js
const store = createStore(counterReducer);
console.log(store.getState());
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
console.log(store.getState());
store.dispatch({ type: "ZERO" });
store.dispatch({ type: "DECREMENT" });
console.log(store.getState());
```
- The following is printed:
```
0
3
-1
```
- The third important method the store has is `subscribe`.
    - Used to create callback functions the store calls whenever an action is dispatched to the store.
    - We can add function to subscribe where every change in the store would be printed to the console.
```js
store.subscribe(() => {
    const storeNow = store.getState();
    console.log(storeNow);
});
```
- The code below:
```js
const store = createStore(counterReducer);

store.subscribe(() => {
    const storeNow = store.getState();
    console.log(storeNow);
});

store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "ZERO" });
store.dispatch({ type: "DECREMENT" });
```
- The following is printed:
```
1
2
3
0
-1
```
- Code for counter app is the following.
    - All code written to the same file `index.js`.
    - The `store` is straight available for the React code.
    - There is a better way to structure React/Redux code that we'll do later.
```js
import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";

const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        case "ZERO":
            return 0;
        default:
            return state;
    }
};

const store = createStore(counterReducer);

const App = () => {
    return (
        <div>
            <div>
                {store.getState()}
            </div>
            <button onClick={e => store.dispatch({ type: "INCREMENT" })}>plus</button>
            <button onClick={e => store.dispatch({ type: "DECREMENT" })}>minus</button>
            <button onClick={e => store.dispatch({ type: "ZERO" })}>zero</button>
        </div>
    );
};

const renderApp = () => {
    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
};

renderApp();
store.subscribe(renderApp);
```
- `App` renders value of counter by asking it from the store with `store.getState()`.
- Action handlers of the buttons dispatch the right actions to the store.
- When state of store is changed, React is not able to auto rerender the app.
    - We have registered a function `renderApp`.
    - Renders the whole app.
    - Listens for changes in the store with `store.subscribe`.
    - Note the immediate call to `renderApp` method.
        - Without this call, the first rendering of the app never happens.


## Redux-Notes
- Aim is to modify our note application to use Redux for state management.
- Let's cover few key concepts.
- First version of our app:
```js
const noteReducer = (state = [], action) => {
    if (action.type === "NEW_NOTE") {
        state.push(action.data);
        return state;
    }

    return state;
};

const store = createStore(noteReducer);

store.dispatch({
    type: "NEW_NOTE",
    data: {
        content: "The app state is in redux store",
        important: true,
        id: 1
    }
});

store.dispatch({
    type: "NEW_NOTE",
    data: {
        content: "State changes are made with actions",
        important: false,
        id: 2
    }
});

const App = () => {
    return (
        <div>
            <ul>
                {store.getState().map(note =>
                    <li key={note.id}>
                        {note.content} <strong>{note.important ? "important" : ""}</strong>
                    </li>
                )}
            </ul>
        </div>
    );
};
```
- No functionality to add new notes other than via dispatching the `NEW_NOTE` actions.
- Now our actions have a type and a field `data` which contains the note to be added.


## Pure Functions, Immutable
- Initial version of reducer is simple:
```js
const noteReducer = (state = [], action) => {
    if (action.type === "NEW_NOTE") {
        state.push(action.data);
        return state;
    }

    return state;
};
```
- State is an array.
- The `NEW_NOTE` action cause new note to be added to state with `push` method.
- App seems to work.
    - Reducer declaration is bad.
    - Breaks assumption of Redux reducers that reducers must be `pure functions`.
    - Pure functions do not cause side effects.
    - Always return same response when called with the same parameters.
- We used the `push` method which changes the state.
    - This is not allowed.
    - Solved by using `concat` method.
    - This creates a new array.
    - Contains all the elements of the old and the new element:
```js
const noteReducer = (state = [], action) => {
    if (action.type === "NEW_NOTE") {
        state.concat(action.data);
        return state;
    }

    return state;
};
```
- Reducer must be composed of immutable objects.
- Change in state means replace old with new, changed, object not changing the object itself.
- Expand reducer so it handles change of a note's importance:
```js
{
    type: "TOGGLE_IMPORTANCE",
    data: {
        id: 2
    }
}
```
- Expand reducer in a test-driven way.
- Create a test for handling the action `NEW_NOTE`.
- Move reducer to its own module to file `src/reducers/noteReducer.js`.
- Add library called `deep-freeze`.
    - Ensures reducer is correctly defined as an immutable function.
    - Install library as a development dependency.
```
$ npm install --save-dev deep-freeze
```
- The test is defined in `src/reducers/noteReducer.test.js`.
```js
import noteReducer from "./noteReducer";
import deepFreeze from "deep-freeze";

describe("noteReducer", () => {
    test("Returns new state with action NEW_NOTE", () => {
        const state = [];
        const action = {
            type: "NEW_NOTE",
            data: {
                content: "The app state is in redux store",
                important: true,
                id: 1
            }
        };

        deepFreeze(state);
        const newState = noteReducer(state, action);

        expect(newState).toHaveLength(1);
        expect(newState).toContainEqual(action.data);
    });
});
```
- The `deepFreeze(state)` ensures the state is immutable.
- Using the `push` method would cause the test to fail.
- Create a test for `TOGGLE_IMPORTANCE` action:
```js
test("Returns new state with action TOGGLE_IMPORTANCE", () => {
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
        type: "TOGGLE_IMPORTANCE",
        data: {
            id: 2
        }
    };

    deepFreeze(state);
    const newState = noteReducer(state, action);

    expect(newState).toHaveLength(2);
    expect(newState).toContainEqual(state[0]);

    expect(newState).toContainEqual({
        content: "State changes are made with action",
        important: true,
        id: 2
    });
});
```
- The following action changes the importance of the note with id of 2.
```js
{
    type: "TOGGLE_IMPORTANCE",
    data: {
        id: 2
    }
}
```
- Reducer is expanded:
```js
const noteReducer = (state = [], action) => {
    switch (action.type) {
        case "NEW_NOTE":
            return state.concat(action.data);
        case "TOGGLE_IMPORTANCE": {
            const id = action.data.id;
            const noteToChange = state.find(n => n.id === id);
            const changedNote = {
                ...noteToChange,
                important: !noteToChange.important
            };
            return state.map(note => note.id !== id ? note : changedNote);
        }
        default:
            return state;
    }
};
```
- Create a copy of the note which importance has changed with syntax from Part 2.
- Replace state with new state containing all notes which have not changed and the copy of the changed note `changedNote`.
- Search for specific note object.
- Create a new object which is a copy of the old note.
- Only the value of `important` is changed.
- The new state is returned.
- Create new state by taking all notes from old state except the note that is to change.


## Array Spread Syntax
- Can now safely refactor the reducer function because tests are good.
- Adding new notes uses the `concat` method.
- Let's use JavaScript `array spread` syntax:
```js
const noteReducer = (state = [], action) => {
    switch (action.type) {
        case "NEW_NOTE":
            return [...state, action.data];
        case "TOGGLE_IMPORTANCE":
            // ...
        default:
            return state;
    }
};
```
- The spread syntax works like so.
- If we have:
```js
const number = [1, 2, 3];
```
- The `...numbers` breaks the array into individual elements that can be placed into another array.
```js
[...numbers, 4, 5];
```
- The result is:
```
[1, 2, 3, 4, 5]
```
- If we placed the array to another array without the spread syntax:
```js
[numbers, 4, 5];
```
- We get:
```
[[1, 2, 3], 4, 5]
```
- We can gather the rest of the elements:
```js
const numbers = [1, 2, 3, 4, 5, 6];

const [first, second, ...rest] = numbers;

console.log(first);     // Prints 1.
console.log(second);    // Prints 2.
console.log(rest);      // Prints [3, 4, 5, 6].
```


## Uncontrolled Form
- Add functionality for adding new notes and changing their importance:
```js
const generateId = () => Number((Math.random() * 1000000).toFixed(0));

const App = () => {
    const addNote = (event) => {
        event.preventDefault();
        const content = event.target.note.value;
        event.target.note.value = "";
        store.dispatch({
            type: "NEW_NOTE",
            data: {
                content,
                important: false,
                id: generateId()
            }
        });
    };

    const toggleImportance = (id) => {
        store.dispatch({
            type: "TOGGLE_IMPORTANCE",
            data: { id }
        });
    };

    return (
        <div>
            <form onSubmit={addNote}>
                <input name="note" />
                <button type="submit">add</button>
            </form>
            <ul>
                {store.getState().map(note =>
                    <li
                        key={note.id}
                        onClick={() => toggleImportance(note.id)}
                    >
                        {note.content} <strong>{note.important ? "important" : ""}</strong>
                    </li>
                )}
            </ul>
        </div>
    );
};
```
- We have not bound state of form fields to state of `App` like we did previously.
    - This is called `uncontrolled form`.
    - Have limitations like dynamic error messages or disabling submit button based on input.
- Method handling for adding new notes is simple.
- Just dispatches action for adding notes.
- Can get content of new note straight from form field.
    - Field has value `event.target.note.value`.
    - Note's importance can be changed by clicking its name.


## Action Creators
- We can simplify our code more.
- Not necessary for React components to know the Redux action types and forms.
- Separate creating actions into their own functions:
```js
const createNote = (content) => {
    return {
        type: "NEW_NOTE",
        data: {
            content,
            important: false,
            id: generateId()
        }
    };
};

const toggleImportanceOf = (id) => {
    return {
        type: "TOGGLE_IMPORTANCE",
        data: { id }
    };
};
```
- Functions that create actions are called `action creators`.
- The `App` does not need to know anything about actions anymore.
    - Gets right actions by calling creator functions.
```js
const App = () => {
    const addNote = (event) => {
        event.preventDefault();
        const content = event.target.note.value;
        event.target.note.value = "";
        store.dispatch(createNote(content));
    };

    const toggleImportance = (id) => {
        store.dispatch(toggleImportanceOf(id));
    };

    // ...
};
```


## Forwarding Redux-Store To Various Components
- Our app is in one file.
- Should separate `App` into its own module.
- But how can `App` access the store after the move?
- Also when we have multiple smaller components in our components, there must be a way for all components to access the store.
- We look into the newest and easiest way using the `hooks`-api of the `react-redux` library.
- Install it:
```
$ npm install react-redux
```
- Move `App` to its own file `App.js`.
- The file `index.js` becomes:
```js
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { createStore } from "redux";
import { Provider } from "react-redux";
import noteReducer from "./reducers/noteReducer";

const store = createStore(noteReducer);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);
```
- Notice that application is now child of `Provider` component.
- The app's store is passed to the Provider as its attribute `store`.
- Defining action creators is moved to `reducers/noteReducer.js` where reducer is defined.
```js
const noteReducer = (state = [], action) => {
    // ...
};

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

export const createNote = (content) => {
    return {
        type: "NEW_NOTE",
        data: {
            content,
            important: false,
            id: generateId()
        }
    };
};

export const toggleImportanceOf = (id) => {
    return {
        type: "TOGGLE_IMPORTANCE",
        data: { id }
    };
};

export default noteReducer;
```
- If app has many components which need the store, `App` needs to pass `store` as props to all of those components.
- Notice module has many `export` commands.
- The reducer function still has the same `export default` command, so nothing changed there.
    - We can import it the same way as usual.
- A module can have only *one* `default export` but multiple "normal" exports.
```js
export const createNote = (content) => {
    // ...
};

export const toggleImportanceOf = (id) => {
    // ...
};
```
- These "normally" exported functions can be imported with curly braces:
```js
import { createNote } from "./../reducers/noteReducer";
```
- Code for the `App` component:
```js
import { createNote, toggleImportanceOf } from "./reducers/noteReducer";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
    const dispatch = useDispatch();
    const notes = useSelector(state => state);

    const addNote = (event) => {
        event.preventDefault();
        const content = event.target.note.value;
        event.target.note.value = "";
        dispatch(createNote(content));
    };

    const toggleImportance = (id) => {
        dispatch(toggleImportanceOf(id));
    };

    return (
        <div>
            <form onSubmit={addNote}>
                <input name="note" />
                <button type="submit">add</button>
            </form>
            <ul>
                {notes.map(note =>
                    <li
                        key={note.id}
                        onClick={() => toggleImportance(note.id)}
                    >
                        {note.content} <strong>{note.important ? "important" : ""}</strong>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default App;
```
- Previously code dispatched actions by calling dispatch method of redux-store:
```js
store.dispatch({
    type: "TOGGLE_IMPORTANCE",
    data: { id }
});
```
- Now it's done with the `dispatch` function from `useDispatch` hook.
- The `useDispatch` hook provides any React component access to dispatch function of redux-store defined in `index.js`.
    - Allows all components to make changes to the state of redux-store.
- Components can access the notes stored in store with the `useSelector` hook of react-redux library.
- `useSelector` receives a function as a parameter.
    - Searches for or selects data from the redux-store.
    - Here, we need all of the notes, so our selector function returns the whole state.
```js
state => state

(state) => {
    return state;
}

// The two above are the same. Second is shorthand version.
```
- Can also just return only notes marked as important:
```js
const importantNotes = useSelector(state => state.filter(note => note.important));
```


## More Components
- Separate creating new note into its own component:
```js
import { useDispatch } from "react-redux";
import { createNote } from "../reducers/noteReducer";

const NewNote = (props) => {
    const dispatch = useDispatch();

    const addNote = (event) => {
        event.preventDefault();
        const content = event.target.note.value;
        event.target.note.value = "";
        dispatch(createNote(content));
    };

    return (
        <form onSubmit={addNote}>
            <input name="note" />
            <button type="submit">add</button>
        </form>
    );
};

export default NewNote;
```
- The event handler for changing the state of the app has been moved from `App` to a child component.
- Logic for changing state in Redux is still neatly separated from the whole React part of the app.
- Separate list of notes and displaying a single note into their own components.
    - Both in the `Notes.js` file:
```js
import { useDispatch, useSelector } from "react-redux";
import { toggleImportanceOf } from "../reducers/noteReducer";

const Note = ({ note, handleClick }) => {
    return (
        <li onClick={handleClick}>
            {note.content}
            <strong> {note.important ? "important" : ""}</strong>
        </li>
    );
};

const Notes = () => {
    const dispatch = useDispatch();
    const notes = useSelector(state => state);

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
- Logic for changing importance of notes is in the component managing list of notes.
- Not much left for `App`:
```js
const App = () => {
    return (
        <div>
            <NewNote />
            <Notes />
        </div>
    );
};
```
- The `Note` component is simple and unaware that the event handler dispatches an action.
    - These components are called `presentational` in React terminology.
- The `Notes` is a `container` component.
    - Contains app logic.
    - Defines what the event handlers of the `Note` components do.
    - Configures `presentational` components.

