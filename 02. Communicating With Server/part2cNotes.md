# Getting Data From Server
- We've only been working on frontend right now.
    - This is client-side functionality.
- The backend will be worked on in Part 3.
- We will now see how code executing in the browser communicates with the backend.
- Use a tool meant to be used during development.
    - `JSON Server` will act as our server.
- Create a file named `db.json` in the root directory with the following:
```json
{
    "notes": [
        {
            "id": 1,
            "content": "HTML is easy",
            "date": "2022-1-17T17:30:31.098Z",
            "important": true
        },
        {
            "id": 2,
            "content": "Browser can execute only JavaScript",
            "date": "2022-1-17T18:39:34.091Z",
            "important": false
        },
        {
            "id": 3,
            "content": "GET and POST are the most important methods of HTTP protocol",
            "date": "2022-1-17T19:20:14.298Z",
            "important": true
        }
    ]
}
```
- Can install `JSON Server` globally:
    - `$ npm install -g json-server`.
    - Requires admin privileges.
    - Global installation not necessary.
- From root of app, run `json-server` using `npx` command:
```
$ npx json-server --port 3001 --watch db.json
```
- `json-server` starts running on 3000 by default.
    - Our CRA app is running in 3000, so we define an alternate port, 3001.
- Navigate to `http://localhost:3001/notes` in the browser.
    - The `notes` is the name of the "notes" property of the JSON object.
    - The notes are served in the browser in JSON format.
- Install plugins to view the format properly.
- Idea is to save notes to the server.
    - Save them to `json-server`.
    - React fetches notes from server and renders to screen.
    - When a new note is added, React sends it to the server to persist in memory.
- `json-server` stores all data in `db.json` file.
    - Resides in server.
    - In the real world, data would be stored in a database.
    - `json-server` is a handy tool that allows the use of server-side functionality in development phase without the need to program it.
    - We will do more of this in Part 3.


## The Browser As A Runtime Environment
- First task is fetching data the notes to the React app from `http://localhost:3001/notes`.
- We learned to fetch data in Part 0 using `XMLHttpRequest`.
    - This is HTTP request made using an XHR object.
    - Introduced in 1999.
    - No longer recommended.
- Browsers support the `fetch` method.
    - Based on `promises` instead of event-driven model used by XHR.
- Example of fetching data using XHR:
```javascript
const xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.responseText);
        // Handle the response that is saved in variable data.
    }
};

xhttp.open("GET", "/data.json", true);
xhttp.send();
```
- When state of `xhttp` object changes, the event handler is called.
    - This represents the HTTP request.
    - If change in state is the response that arrived, then data is handled accordingly.
- Notice the code in event handler is defined before the request is sent to the server.
    - The code in event handler executes later in time.
    - Code does not execute top-to-bottom.
    - So code does not execute `synchronously`. It executes `asynchronously`.
- There's Java code that's similar to what's happening.
    - Basically, the program waits for `request.get(...)` to finish.
    - Notes then stored in variable.
    - Then notes are processed.
- JavaScript engines follow `asynchronous model`.
    - Requires that all `IO-operations` execute as non-blocking.
    - Means that code execution happens immediately after calling IO function without waiting for it to return.
- When asynchronous operation is done at some point after its completion.
    - JavaScript engine calls the event handler registered to operation.
- JS engines are `single-threaded`.
    - Cannot execute code in parallel.
    - Requirement to use non-blocking model for executing IO operation.
    - Else, the browser will "freeze" during the fetching of data from a server.
- Another consequence of being single-threaded:
    - If some code execution takes up a lot of time, browser will be stuck during the duration.
- If we ran this code:
```javascript
setTimeout(() => {
    console.log("loop...");
    let i = 0;
    while (i < 50000000000) {
        i++;
    }
    console.log("end");
}, 5000);
```
- Everything works normally for 5 seconds.
- When function defined is run, the browser will be stuck during the execution of the loop.
- In order to remain responsive, code shouldn't be too long doing one task.
- In today's browsers, it is possible to run parallelized code with the help of `web workers`.
    - Event loop of a single browser is handled only by a single thread.


## npm
- Get back to fetching data from server.
- We can use the promise based function `fetch` to pull data.
    - It's good and standardized by all modern browsers.
- We will use `axios` library instead for communication between browser and server.
    - It's like `fetch`.
    - More pleasant to use.
- Nowadays, all JavaScript projects are defined using `node package manager (npm)`.
    - CRA projects use npm.
    - Clear indicator is the use of `package.json` file in the root.
```json
{
    "name": "notes",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
        "@testing-library/jest-dom": "^5.16.1",
        "@testing-library/react": "^12.1.2",
        "@testing-library/user-event": "^13.5.0",
        "react": "^17.0.2",
        "react-dom": "^17.0.2",
        "react-scripts": "5.0.0",
        "web-vitals": "^2.1.3"
    },
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    },
    "eslintConfig": {
        "extends": [
        "react-app",
        "react-app/jest"
        ]
    },
    "browserslist": {
        "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
        ],
        "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
        ]
    }
}
```
- Right now, the `dependencies` section is most interesting to us.
    - This means external libraries the project has.
- We want to use axios, so install it:
```
$ npm install axios
```
- `npm` commands should always be run in root directory.
- Axios is now included in dependencies:
```json
{
    "name": "notes",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
        "@testing-library/jest-dom": "^5.16.1",
        "@testing-library/react": "^12.1.2",
        "@testing-library/user-event": "^13.5.0",
        "axios": "^0.24.0",
        "react": "^17.0.2",
        "react-dom": "^17.0.2",
        "react-scripts": "5.0.0",
        "web-vitals": "^2.1.3"
    },
    // ...
}
```
- The `npm install` command downloaded the library code.
- Code can be found in `node_modules` directory in the root.
- Install `json-server` as development dependency (only used during development).
```
$ npm install json-server --save-dev
```
- Add this to the `scripts` section:
```json
{
    // ...
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "server": "json-server -p3001 --watch db.json"
    },
    // ...
}
```
- Can now start the `json-server` by running:
```
$ npm run server
```
- So, `axios` is installed as a `runtime dependency`.
    - The execution of the program requires the existence of the library.
- `json-server` was installed as a `development dependency` using `--save-dev`.
    - The program itself does not require it.
    - Used for assistance during software development.


## Axios and Promises
- Ready to use axios.
- Assume from now on that `json-server` is running on port 3001.
    - May need to use two terminals.
        - One for CRA app.
        - One for json-server.
- Use the `import` statement.
- Add the following to `index.js`:
```javascript
import axios from "axios";

const promise = axios.get("http://localhost:3001/notes");
console.log(promise);

const promise2 = axios.get("http://localhost:3001/foobar");
console.log(promise2);
```
- Open `http://localhost:3001`.
    - We see two `Promise` objects in console.
- When `index.js` changes, React does not always notice automatically.
    - Refresh browser.
    - Simple workaround is to create a file `.env` in the root of the project.
        - Add the line `FAST_REFRESH=false`.
        - Restart the app.
- The `get` method of axios returns a `promise`.
    - **A Promise is an object representing the eventual completion or failure of an asynchronous operation.**
- Promise is an object that represents an asynchronous operation.
- Three states:
    1. Promise is `pending`.
        - The final value is not yet available.
    2. Promise is `fulfilled`.
        - The operation has completed and the final value is available.
        - Successful operation.
        - Also called `resolved`.
    3. Promise is `rejected`.
        - An error prevented the final value from being determined.
        - Failed operation.
- First promise in example above is `fulfilled`.
- The second promise is `rejected`.
    - We made an HTTP GET request to a non-existent address.
- If we want to access the result of the operation represented by a promise.
    - Register an event handler to the promise.
    - Done by using `then` method.
```javascript
const promise = axios.get("http://localhost:3001/notes");

promise.then(response => {
    console.log(response);
});
```
- We see the whole `response` object get printed to the console.
- The JavaScript runtime environment calls the callback function registered by `then`.
    - Provides the `response` object as a parameter.
    - This object contains all data related to response of an HTTP GET request.
        - Includes things like `data`, `status code`, and `headers`.
- Do not have to store promise object in a variable.
    - Preferred to chain `then` method to axios call.
```javascript
axios.get("http://localhost:3001/notes").then(response => {
    const notes = response.data;
    console.log(notes);
});
```
- The callback function takes data contained in `response` object and stores in variable.
- Then it prints it.
- More readable way to format `chained` methods is to place each call on its own line.
```javascript
axios
    .get("http://localhost:3001/notes")
    .then(response => {
        const notes = response.data;
        console.log(notes);
    });
```
- Data returned by server is plaintext.
    - One long string.
- Axios library can still parse data into a JS array.
    - This is because the server specified that the data format is `application/json; charset=utf-8`.
    - Done using `content-type` header.
- Can now use data fetched from server.
- Try and request notes from local server and render it.
    - Initially as `App`.
    - This approach has many issues.
        - We are rendering entire `App` component only when we successfully get a response.
- Change `index.js`.
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import App from "./App";

axios.get("http://localhost:3001/notes").then(response => {
    const notes = response.data;
    ReactDOM.createRoot(document.getElementById("root")).render(<App notes={notes} />);
});
```
- Instead move fetching of data in the `App` component.
- Where should we place the `axios.get` command in the component?


## Effect-Hooks
- We have already used `state hooks`.
- We also have `effect hooks`.
    - **The Effect Hook lets your perform side effects on function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.**
- Effect hooks are right when fetching data.
- Remove fetching of data from `index.js`.
    - No need to pass props to `App`.
    - Simplify `index.js`.
```javascript
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```
- Change `App.js`:
```javascript
import { useState, useEffect } from "react";
import axios from "axios";
import Note from "./components/Note";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showAll, setShowAll] = useState(true);

    useEffect(() => {
        console.log("effect");
        axios
            .get("http://localhost:3001/notes")
            .then(response => {
                console.log("promise fulfilled");
                setNotes(response.data);
            });
    }, []);
    console.log("render", notes.length, "notes");

    //
};
```
- The prints are below:
```
render 0 notes
effect
promise fulfilled
render 3 notes
```
- Body of function defining component is executed and component rendered for the first time.
- The `render 0 notes` is printed.
- Then, the function defined in `useEffect` is called immediately.
- Then, `effect` is printed.
- The command `axios.get()` gets called and starts fetching from server.
- Registers the attached event handler.
- When data comes from the server, JS calls the function event handler.
- The `promise fulfilled` prints and stores the notes retrieved into the `notes` state.
    - This triggers a re-render because we changed the state.
- Then, `render 3 notes` is printed.
- Write the `useEffect` code above a bit differently.
```javascript
const hook = () => {
    console.log("effect");
    axios
        .get("http://localhost:3001/notes")
        .then(response => {
            console.log(response.data);
            setNotes(response.data);
        });
};

useEffect(hook, []);
```
- It's now more clear.
    - The `useEffect` function takes two parameters.
    - The first is a function, the `effect` itself.
        - **By default, effects run after every completed render, but you can choose to fire it only when certain values have changed**.
    - The `effect` is always run after every render.
    - If the second parameter is an empty array, `[]`, then `effect` is run only after the first render.
- Could also write code like this:
```javascript
useEffect(() => {
    console.log("effect");

    const eventHandler = response => {
        console.log("promise fulfilled");
        setNotes(response.data);
    };

    const promise = axios.get("http://localhost:3001/notes");
    promise.then(eventHandler);
}, []);
```
- A more compact representation is recommended:
```javascript
useEffect(() => {
    console.log("effect");
    axios
        .get("http://localhost:3001/notes")
        .then(response => {
            console.log("promise fulfilled");
            setNotes(response.data);
        });
}, []);
```
- Still have a problem.
    - When adding new notes, they are not stored on the server.


## The Development Runtime Environment
- The whole system got more complex.
- Review what happens and where.
    - The JS code making up React app runs in the browser.
    - Browser gets JS from `React dev server` (when you run `npm start`).
        - The dev server transforms JS into format understood by browser.
        - It stitches together JS from different files into one file.
        - Discussed more in Part 7.
    - The React app running in browser fetches JSON data from `json-server` on port 3001.
        - `json-server` gets its data from `db.json` file.
    - All parts of the app happen to reside on developer's machine (localhost).
        - Situation changes when app is deployed to internet.
        - Doing this in Part 3.

    