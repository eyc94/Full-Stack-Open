# Node.js and Express
- Focus goes to the backend now.
    - Implement server side functionality.
- Build backend on top of `NodeJS`.
    - This is a JS runtime based on `Chrome V8` JS engine.
- JS running in the backend can be any version.
    - Newest version of Node supports large majority of the latest features of JS.
    - No need to transpile.
- Goal is to make a backend that works with notes-frontend from Part 2.
- Start with basics by making "hello world" application.
- We will not use `create-react-app` because not all apps are React apps.
- We mentioned `npm` back in Part 2.
    - Tool for managing JS packages.
    - `npm` originates from the Node ecosystem.
- Go to an appropriate directory.
    - Create new template with `$ npm init` command.
    - Answer the questions and it will create a `package.json` file at the root.
    - Contains information about the project.
```json
{
    "name": "backend",
    "version": "0.0.1",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "EC",
    "license": "MIT"
}
```
- The entry point is `index.js`.
- Make a change to `scripts`.
```json
{
    // ...
    "scripts": {
        "start": "node index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    // ...
}
```
- Add an `index.js` file to the root of the project with the following code:
```javascript
console.log("hello world");
```
- We can also just run the program directly with Node:
```
$ node index.js
```
- Or, we can run it as an `npm script`:
```
$ npm start
```
- It is customary for npm projects to execute as npm scripts.
- There is also `npm test`.
- Project does not yet have a testing library, so it doesn't do much.


## Simple Web Server
- Change application into a web server.
    - Change `index.js`:
```javascript
const http = require("http");

const app = http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello World");
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```
- Can open the application on `http://localhost:3001`.
    - It just has "Hello World" printed as a page.
- Server works the same way regardless of the latter part of URL.
    - For example, `http://localhost:3001/foo/bar` still works and displays the same contents.
- The first line imports Node's built-in `web server` module.
- Code that runs in browser uses ES6 modules.
    - Defined with `export` and used with `import`.
- Node.js uses `CommonJS` modules.
    - This is because Node needed modules long before JavaScript supported them.
    - Now, also supports the use of ES6 modules.
    - Stick to `CommonJS` because the support is not yet perfect.
    - Works exactly like ES6 modules.
- The next chunk uses the `createServer` method of `http` module to create new web server.
    - Event handler is registered to the server.
    - Called *every time* an HTTP request is made to server's address `http://localhost:3001`.
    - Request responded to with status code 200 with `Content-Type` header set.
    - The content to be returned is set to `Hello World`.
- Last row binds http server to listen to HTTP requests sent to port 3001.
- The purpose of our backend server is to return raw data in JSON format to the frontend.
    - Change our server to return a hard-coded list of notes in JSON format.
```javascript
const http = require("http");

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2022-05-30T17:30:21.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    }
];

const app = http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(notes));
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```
- Restart server and refresh browser.
- The `application/json` value informs receiver that the data is in JSON format.
    - The `notes` array gets transformed to JSON with `JSON.stringify(notes)`.
- When we open the browser, the displayed format is exactly the same as Part 2 where we used `json-server` to server our notes.


