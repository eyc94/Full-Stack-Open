# props.children and prototypes

## Displaying The Login Form Only When Appropriate
- Modify app so that login form is not displayed by default.
- Login form appears when the user presses the `login` button.
- The user can close the login form by clicking the `cancel` button.
- Extract the login form into its own component.
```js
const LoginForm = ({
        handleSubmit,
        handleUsernameChange,
        handlePasswordChange,
        username,
        password
    }) => {

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    Username
                    <input
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
```
- State and all functions related to it are defined outside of the component.
    - Passed to the component as props.
- Props are assigned to variables through `destructuring`.
    - Instead of accessing things like `props.handleSubmit`, you just destructure to access it faster.
- Implementing the functionality of login button and cancel button.
    - You can do it one way like so:
```js
const App = () => {
    const [loginVisible, setLoginVisible] = useState(false);

    // ...

    const loginForm = () => {
        const hideWhenVisible = { display: loginVisible ? "none" : "" };
        const showWhenVisible = { display: loginVisible ? "" : "none" };

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>Login</button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                    <button onClick={() => setLoginVisible(false)}>Cancel</button>
                </div>
            </div>
        );
    };

    // ...
};
```
- Notice the state `loginVisible`.
    - This represents whether the login form is visible or not.
    - This value is switched by two buttons.
    - Both buttons have event handlers directly defined.
- Visibility of component is defined by giving component an `inline` style rule.
    - Value of `display` is `none` if we do not want component to be displayed.


## The Components Children, aka. props.children
- Code for managing visibility of login form could be considered to be its own logical entity.
    - Extract to its own component.
- Implement a new `Togglable` component that can be used in the following way:
```js
<Togglable buttonLabel="login">
    <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
    />
</Togglable>
```
- Notice this component has both the opening and closing tags.
    - They surround the `LoginForm` component.
    - The `LoginForm` is a child component of `Togglable`.
- Can add any React elements between opening and closing tags of `Togglable`.
```js
<Togglable buttonLabel="reveal">
    <p>This line is at start hidden</p>
    <p>Also this is hidden</p>
</Togglable>
```
- The code for `Togglable` is below:
```js
import { useState } from "react";

const Togglable = (props) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </div>
    )
};

export default Togglable;
```
- New part of the code is `props.children`.
    - References child components of the component.
    - Child components are React elements we define between the opening and closing tags of a component.
- The children are rendered in the code used for rendering the component itself.
- The `children` is auto added by React and always exist.
- If component is defined with an auto closing `/>` tag, `props.children` is an empty array.
- The `Togglable` component is reusable.
    - Can use it to add similar visibility toggling to the form that is used for creating new notes.
- Extract the form for creating notes into its own component:
```js
const NoteForm = ({ onSubmit, handleChange, value }) => {
    return (
        <div>
            <h2>Create A New Note</h2>

            <form onSubmit={onSubmit}>
                <input
                    value={value}
                    onChange={handleChange}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};
```
- Define form component inside of `Togglable` component:
```js
<Togglable buttonLabel="New Note">
    <NoteForm
        onSubmit={addNote}
        value={newNote}
        handleChange={handleNoteChange}
    />
</Togglable>
```


## State Of The Forms
- State of application is in `App`.
- React says this about where to place state:
    - **Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.**
- If we think about the state of forms.
    - Like contents of new note before it is created.
    - `App` does not need it for anything.
    - Just move this state down to the corresponding components.
- Component for a note changes like:
```js
import { useState } from "react";

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState("");

    const handleChange = (event) => {
        setNewNote(event.target.value);
    };

    const addNote = (event) => {
        event.preventDefault();
        createNote({
            content: newNote,
            important: Math.random() > 0.5
        });

        setNewNote("");
    };

    return (
        <div>
            <h2>Create A New Note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default NoteForm;
```
- Notice we moved functions and state to the `NoteForm` component.
- The `createNote` function is not moved however.
- Can do the same for the login form.


## References To Components With ref
- One aspect can be improved.
- After new note is created, it makes sense to hide the new note form.
    - Form stays visible.
- Problem because visibility is controlled with `visible` variable inside of `Togglable` component.
    - Can we access this outside of the component?
- Many ways to implement closing the form from the parent component.
    - Use `ref` mechanism of React.
    - Offers reference to the component.
- Make the following changes to `App`:
```js
import { useState, useEffect, useRef } from "react";

const App = () => {
    // ...
    const noteFormRef = useRef();

    const noteForm = () => (
        <Togglable buttonLabel="New Note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
        </Togglable>
    );

    // ...
};
```
- `useRef` hook is used to create a `noteFormRef` ref.
    - Assigned to `Togglable` component.
        - Contains the note creation form.
- `noteFormRef` acts as a reference to the component.
    - Hook ensures the same reference (ref) is kept throughout re-renders of the component.
- Then make the changes to the `Togglable` component.
```js
import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    useImperativeHandle(refs, () => {
        return {
            toggleVisibility
        };
    });

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </div>
    );
});

export default Togglable;
```
- Function that creates the component is wrapped in a `forwardRef` function call.
    - Component can access the ref assigned to it.
- Component uses `useImperativeHandle` hook to make its `toggleVisibility` function available outside of the component.
- Can now hide form by calling `noteFormRef.current.toggleVisibility()` after new note is created:
```js
const App = () => {
    // ...
    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility();
        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
            });
    };
    // ...
}
```
- To recap:
    - The `useImperativeHandle` function is a React hook.
        - Used for defining functions in component which can be invoked from outside the component.
    - Works for changing state of component.
    - Looks unpleasant.
    - Could have done the same thing with Old React and make it look cleaner with class-based components.
        - This is the only case where using React hooks leads to code that is not cleaner than class components.
    - There are other use cases for refs other than accessing React components.


## One Point About Components
- When we define a component in React:
```js
const Togglable = () => {
    // ...
};
```
- And use it like this:
```js
<div>
    <Togglable buttonLabel="1" ref={togglable1}>
        first
    </Togglable>

    <Togglable buttonLabel="2" ref={togglable2}>
        second
    </Togglable>

    <Togglable buttonLabel="3" ref={togglable3}>
        third
    </Togglable>
</div>
```
- We create three separate instances of the component that all have their own separate state!
- `ref` attribute is used for assigning a reference to each of the components in variables `togglable1`, `togglable2`, and `togglable3`.


