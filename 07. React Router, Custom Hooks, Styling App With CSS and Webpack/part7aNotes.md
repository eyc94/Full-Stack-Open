# React-Router
- The exercises in Part 7 differ from before.
- There are exercises related to the theory in the chapter.
- There are series of exercises in which we'll be revising what we've learned.
    - We will touch upon the Bloglist application we worked on in Parts 4 & 5.


## Application Navigation Structure
- We return to React without Redux.
- Very common for applications to have navigation bar.
    - Switching between views.
- The app can have a main page.
- It can have separate pages for notes and users.
- In old school web app, to change pages, the browser makes an HTTP GET request to the server.
    - Renders the HTML representing the view that was returned.
- In SPAs, we are technically on the same page.
    - The browser creates an illusion of different pages.
    - If HTTP requests are made when switching views, they are only for fetching JSON data.
- The nav bar and application containing multiple views is very easy to make using React:
```js
import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const Home = () => (
    <div><h2>EC Notes App</h2></div>
);

const Notes = () => (
    <div><h2>Notes</h2></div>
);

const Users = () => (
    <div><h2>Users</h2></div>
);

const App = () => {
    const [page, setPage] = useState("home");

    const toPage = (page) => (event) => {
        event.preventDefault();
        setPage(page);
    };

    const content = () => {
        if (page === "home") {
            return <Home />
        } else if (page === "notes") {
            return <Notes />
        } else if (page === "users") {
            return <Users />
        }
    };

    const padding = {
        padding: 5
    };

    return (
        <div>
            <div>
                <a href="" onClick={toPage("home")} style={padding}>Home</a>
                <a href="" onClick={toPage("notes")} style={padding}>Notes</a>
                <a href="" onClick={toPage("users")} style={padding}>Users</a>
            </div>
            {content()}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />, document.getElementById("root"));
```
- Each view is implemented as its own component.
- Store view component information in app state called `page`.
- This tells us which component view is shown.
- This method is not optimal.
    - Address stays the same regardless of view.
    - Each view should have its own address.
    - The back button does not work.
    - If app grows bigger and we wanted separate views for each user and note, this routing gets complicated.


## React Router
- React has the `React Router` library.
    - Can manage navigation in a React application.
- Change above applicatioin to use React Router.
- Install React Router:
```
$ npm install react-router-dom
```
- Change application:
```js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
    const padding = {
        padding: 5
    };

    return (
        <Router>
            <div>
                <Link style={padding} to="/">Home</Link>
                <Link style={padding} to="/notes">Notes</Link>
                <Link style={padding} to="/users">Users</Link>
            </div>

            <Routes>
                <Route path="/notes" element={<Notes />} />
                <Route path="/users" element={<Users />} />
                <Route path="/" element={<Home />} />
            </Routes>

            <div>
                <i>EC Note App 2022</i>
            </div>
        </Router>
    );
};
```
- This is the conditional rendering of components based on url in the browser.
    - Place components as children of the `Router` component.
- Notice that `Router` is actually the `BrowserRouter` component.
    - We renamed the import.
- According to the manual:
    - **BrowserRouter is a Router that uses the HTML5 history API (pushState, replaceState, and the popState event) to keep your UI in sync with the URL.**
- Normally, browser loads new page when URL changes.
    - With help of HTML5 history API, `BrowserRouter` allows us to use the URL for internal routing in a React app.
    - So content of page is only manipulated using JS.
    - Browser does not load new content from the server.
    - Using back and forth actions and bookmarks still work.
- We define `Link` to link to a route.
    - When you click it, the URL changes in the address bar.
- Components rendered based on URL are defined with `Route` component.
    - We render a component based on the URL route path.
    - Wrap the `Route` components in `Routes` component.
    - The `Routes` work by rendering the first component whose path matches the URL in the browser's address bar.


## Parameterized Route
- Examine modified version from previous example.
- Code can be found here:
    - `https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js`
- App now contains five different views whose display is controlled by the router.
    - The views from the previous example are `Home`, `Notes`, and `Users`.
    - We now have `Login` representing the login view.
    - We have `Note` representing the view of a single note.
- The `Home` and `Users` is not changed.
    - The `Notes` is more complicated.
    - Renders the list of notes passed to it as props in a way such that name of each note is clickable.
- Ability to click name is done with `Link` component.
    - Clicking note with id of 3 would trigger event that changes address of browser to `notes/3`.
```js
const Notes = ({ notes }) => (
    <div>
        <h2>Notes</h2>
        <ul>
            {notes.map(note =>
                <li key={note.id}>
                    <Link to={`/notes/${note.id}`}>{note.content}</Link>
                </li>
            )}
        </ul>
    </div>
);
```
- Define parameterized urls in routing in `App`:
```js
<Router>
    // ...

    <Routes>
        <Route path="/notes/:id" element={<Note notes={notes} />} />
        <Route path="/notes" element={<Note notes={notes} />} />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
    </Routes>
</Router>
```
- Define the route for rendering a specific not like Express.
- Use a colon.
- When browser navigates to the url for a specific note, we render the `Note` component:
```js
import {
    // ...
    useParams
} from "react-router-dom";

const Note = ({ notes }) => {
    const id = useParams().id;
    const note = notes.find(n => n.id === Number(id));
    return (
        <div>
            <h2>{note.content}</h2>
            <div>{note.user}</div>
            <div><strong>{note.important ? "important" : ""}</strong></div>
        </div>
    );
};
```
- `Note` receives all of the notes as props `notes`.
    - Access the url (id of note to display) with `useParams` function of React Router.


## useNavigate
- We also have a login function for our app.
- If user is logged in, the user's info is saved to `user` field of state of `App`.
- Option to navigate to `Login` view is rendered conditionally.
```js
<Router>
    <div>
        <Link style={padding} to="/">Home</Link>
        <Link style={padding} to="/notes">Notes</Link>
        <Link style={padding} to="/users">Users</Link>
        {user
            ? <em>{user} logged in</em>
            : <Link style={padding} to="/login">Login</Link>
        }
    </div>
    // ...
</Router>
```
- If user is already logged in, it does not display the `Login` link.
    - Shows username.
- Code for component handling login functionality:
```js
import {
    // ...
    useNavigate
} from "react-router-dom";

const Login = (props) => {
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        props.onLogin("echin");
        navigate("/");
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    Username: <input />
                </div>
                <div>
                    Password: <input type="password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};
```
- Notice the `useNavigate` function of React Router.
    - The browser's URL can change programmatically.
- When user logs in, we call `navigate("/")`.
    - Causes browser's URL to change to `/`.
    - App renders `Home` component.
- The `useParams` and `useNavigate` are hook functions.
    - Like `useState` and `useEffect`.
    - There are rules to using hook functions.
    - One of the rules is not to use hook functions from a conditional statement.


## redirect
- Interesting detail about `Users` route:
```js
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```
- If user is not logged in, the `Users` component is not rendered.
    - Instead redirected using `Navigate` component to login view.
- In reality, it's better to not show links in nav bar requiring login if user is not logged in to application.
- `App` component in its entirety:
```js
const App = () => {
    const [notes, setNotes] = useState([
        // ...
    ]);

    const [user, setUser] = useState(null);

    const login = (user) => {
        setUser(user);
    };

    const padding = {
        padding: 5
    };

    return (
        <div>
            <Router>
                <div>
                    <Link style={padding} to="/">Home</Link>
                    <Link style={padding} to="/notes">Notes</Link>
                    <Link style={padding} to="/users">Users</Link>
                    {user
                        ? <em>{user} logged in</em>
                        : <Link style={padding} to="/login">Login</Link>
                    }
                </div>

                <Routes>
                    <Route path="/notes/:id" element={<Notes notes={notes} />} />
                    <Route path="/notes" element={<Notes notes={notes} />} />
                    <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
                    <Route path="/login" element={<Login onLogin={login} />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
            <footer>
                <br />
                <em>EC Note App 2022</em>
            </footer>
        </div>
    );
};
```
- Define `footer` element that is common.
- Defined outside `Router`.
    - Shown regardless of component in routed part of the application.


## Parameterized Routes Revisited
- App has a flaw.
- The `Note` receives all notes when we only need one.
- Can we modify app so that `Note` receives only the component it should display?
```js
const Note = ({ note }) => (
    return (
        <div>
            <h2>{note.content}</h2>
            <div>{note.user}</div>
            <div><strong>{note.important ? "important" : ""}</strong></div>
        </div>
    );
);
```
- One way is to use React Router's `useMatch` hook.
    - Figures out id of the note to be displayed in the `App` component.
    - Not possible to use this hook in component that defines the routed part of app.
- Move `Router` component from `App`:
```js
ReactDOM.createRoot(document.getElementById("root")).render(
    <Router>
        <App />
    </Router>,
    document.getElementById("root")
);
```
- The `App` is now:
```js
import {
    // ...
    useMatch
} from "react-router-dom";

const App = () => {
    // ...

    const match = useMatch("/notes/:id");
    const note = match
        ? note.find(note => note.id === Number(match.params.id))
        : null;
    
    return (
        <div>
            <div>
                <Link style={padding} to="/">Home</Link>
                // ...
            </div>

            <Routes>
                <Route path="/notes/:id" element={<Notes note={note} />} />
                <Route path="/notes" element={<Notes notes={notes} />} />
                <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
                <Route path="/login" element={<Login onLogin={login} />} />
                <Route path="/" element={<Home />} />
            </Routes>
            <div>
                <i>EC Note App 2022</i>
            </div>
        </div>
    )
};
```
- Every time the component is rendered (i.e. every time browser URL changes).
    - The `useMatch` command is executed.
- If URL matches `/notes/:id`:
    - Match variable will contain an object from which we can access:
        - The parameterized part of the path.
        - The id of the note to be displayed.
    - Then we can fetch the correct note to display.

