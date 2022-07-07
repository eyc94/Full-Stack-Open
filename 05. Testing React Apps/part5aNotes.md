# Login in Frontend
- Last two parts dealt with backend.
- The frontend does not support user management we did to the backend in Part 4.
- The frontend shows existing notes.
    - Lets the user change state of a note from important to not important (and vice versa).
    - New notes cannot be added anymore.
        - Because backend now expects a token verifying user's identity is sent with the new note.


## Handling Login
- Login form added to top of the page.
- Form for adding new notes is moved to the bottom of the list of notes.
- Code for `App.js` is now:
```js
const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        noteService
            .getAll().then(initialNotes => {
                setNotes(initialNotes);
            });
    }, []);

    // ...

    const handleLogin = (event) => {
        event.preventDefault();
        console.log("Logging in with", username, password);
    };

    return (
        <div>
            <h1>Notes</h1>

            <Notification message={errorMessage} />

            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>

            // ...
        </div>
    )
};
```
- To see data in notes frontend, run the server in the notes backend.
    - `npm run dev`
- Login form is handled the same way we did in Part 2.
    - App state has fields for `username` and `password` to store data from form data.
    - Form fields have event handlers to handle change of the field.
        - Event handlers are simple.
        - Object is given to the handlers as a parameter.
        - The objects are destructured for the field `target`.
        - It then saves its value to the state.
- The `handleLogin` is yet to be implemented.
- Logging in is done by sending HTTP POST request to server address `/api/login`.
    - Separate code responsible for this request.
    - Move it to the file `services/login.js`.
- Use `async/await` syntax instead of promises for HTTP request.
```js
import axios from "axios";
const baseUrl = "/api/login";

const login = async credentials => {
    const response = await axios.post(baseUrl, credentials);
    return response.data;
};

export default { login };
```
- The method for handling the login is implemented like:
```js
import loginService from "./services/login";

const App = () => {
    // ...
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username, password
            });
            setUser(user);
            setUsername("");
            setPassword("");
        } catch (exception) {
            setErrorMessage("Wrong credentials");
            setTimeout(() => {
                setErrorMessage(null);
            } 5000);
        }
    };

    // ...
};
```
- If successful login, the form fields are emptied and server respnose is saved to the `user` state.
- If login fails, the user is notified with a message.
    - User is not notified of a successful login.
- Show login form only if user not logged in.
    - When `user === null`.
- The form for adding new notes is shown only if user is logged in.
    - So `user` contains user details.
- Add two helper functions to `App` for generating forms.
```js
const App = () => {
    // ...

    const loginForm = () => {
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</form>
        </form>
    };

    const noteForm = () => {
        <form onSubmit={addNote}>
            <input
                value={newNote}
                onChange={handleNoteChange}
            />
            <button type="submit">save</button>
        </form>
    };

    return (
        // ...
    );
};
```
- Conditionally render them.
```js
const App = () => {
    // ...

    const loginForm = () => {
        // ...
    };

    const noteForm = () => {
        // ...
    };

    return (
        <div>
            <h1>Notes</h1>

            <Notification message={errorMessage} />

            {user === null && loginForm()}
            {user !== null && noteForm()}

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notesToShow.map((note, i) =>
                    <Note
                        key={i}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )}
            </ul>

            <Footer />
        </div>
    );
};
```
- Can make the above more straightforward by using conditional operator.
```js
return (
    <div>
        <h1>Notes</h1>

        <Notification message={errorMessage} />

        {user === null ?
            loginForm() :
            noteForm()
        }

        <h2>Notes</h2>

        // ...

    </div>
);
```
- Do one more thing.
- If user is logged in, their name is shown on the screen.
```js
return (
    <div>
        <h1>Notes</h1>

        <Notification message={errorMessage} />

        {user === null ?
            loginForm() :
            <div>
                <p>{user.name} logged-in</p>
                {noteForm()}
            </div>
        }

        <h2>Notes</h2>

        // ...

    </div>
);
```
- The main `App` component is too large.
- Should refactor.


## Creating New Notes
- Token returned with successful login is saved to the app's state.
    - The `user`'s field `token`.
- Fix creating new notes so it works with backend.
    - Add token of logged-in user to the Authorization header of HTTP request.
- The `noteService` module changes:
```js
import axios from "axios";
const baseUrl = "/api/notes";

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`;
};

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = async newObject => {
    const config = {
        headers: { Authorization: token }
    };

    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
};

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
};

export default { getAll, create, update, setToken };
```
- The module has a private variable `token`.
- Value can be changed with function `setToken`.
    - Exported by the module.
- The `create` function is now `async/await` function.
    - Sets the token to the `Authorization` header.
    - Header is given to axios as the third parameter of `post` method.
- Event handler that handles login must call `noteService.setToken(user.token)` with successful login.
```js
const handleLogin = async (event) => {
    event.preventDefault();
    try {
        const user = await loginService.login({
            username, password
        });

        noteService.setToken(user.token);
        setUser(user);
        setUsername("");
        setPassword("");
    } catch (exception) {
        // ...
    }
};
```


## Saving The Token To The Browser's Local Storage
- When page is rerendered, user info disappears.
- Slows down development.
    - When testing creating new notes, we have to login every single time.
- Solved by saving the login details to `local storage`.
    - `key-value` database in the browser.
- Easy to use.
    - Set a `value` to a `key` with `setItem` method.
```js
window.localStorage.setItem("name", "juha tauriainen");
```
- Saves the string given as parameter as the value of key `name`.
- Value of key is found with `getItem` function.
- Use `removeItem` function to remove a key.
- Values in local storage are persisted even when page is rerendered.
    - Storage is `origin` specific.
    - Each web app has its own storage.
- Extend app so it saves details of logged-in user to the local storage.
- Values saved to storage are `DOMstrings`.
    - Cannot save JS object as is.
    - Object has to be parsed to JSON first.
    - Use `JSON.stringify`.
    - When a JSON object is read from local storage, it has to be parsed back to JS with `JSON.parse`.
- Change login method:
```js
const handleLogin = async (event) => {
    event.preventDefault();
    try {
        const user = await loginService.login({
            username, password
        });

        window.localStorage.setItem(
            "loggedNoteappUser", JSON.stringify(user)
        );
        noteService.setToken(user.token);
        setUser(user);
        setUsername("");
        setPassword("");
    } catch (exception) {
        // ...
    }
};
```
- Can view on console by typing: `window.localStorage`.
- Can also inspect local storage using dev tools.
    - On Chrome, go to `Application` tab and select `Local Storage`.
    - On Firefox, go to `Storage` tab and select `Local Storage`.
- Still have to check whether user detail of logged-in user can already be found in local storage.
    - If so, details are saved to the state of application and to `noteService`.
- Right way is to use the `effect hook`.
- Can have multiple effect hooks.
    - Create a second one to handle the first loading of the page.
```js
const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        noteService
            .getAll().then(initialNotes => {
                setNotes(initialNotes);
            });
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            noteService.setToken(user.token);
        }
    }, []);

    // ...
};
```
- The empty array as the second parameter ensures the effect is executed when component is rendered for the first time.
- User stays logged-in in the app forever.
- Should add a logout functionality that removes the login details from local storage.
    - Leave this as an exercise.
- Can logout in console with: `window.localStorage.removeItem("loggedNoteappUser")`.
- Or clear local storage completely with: `window.localStorage.clear()`.


