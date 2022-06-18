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


