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

