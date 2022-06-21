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


## Express
- Using `http` is cumbersome.
    - Especially when the application grows in size.
- Libraries are offered to ease server-side development.
    - One library is `express`.
- Install `express`.
```
$ npm install express
```
- The dependency is added to our `package.json`.
```json
{
    // ...
    "dependencies": {
        "express": "^4.17.2"
    }
}
```
- Source code for dependency is added to `node_modules` folder.
    - There are a bunch of `transitive dependencies` in this folder.
- What does the caret mean?
    - Versioning model used in npm is called `semantic versioning`.
    - If and when the dependencies of a project are updated, the version of express that is installed will be at least 4.17.2.
    - The installed version of express can also be on that has a larger *patch* number (last number).
    - Can have larger *minor* number (middle number).
    - The *major* number (first number) must be the same.
- We can update dependencies with:
```
$ npm update
```
- If we start working on this project on another computer, we can install all up-to-date dependencies in `package.json`.
```
$ npm install
```
- If *major* number does not change, then newer versions should be `backwards compatible`.
    - If our app uses version 4.99.175 of express in the future.
    - All code implemented would still have to work without making changes to the code.
    - If the future version was 5.0.0 express may contain changes that would cause our application not to work.


## Web and Express
- Go back to our application and make the following changes.
```javascript
const express = require("express");
const app = express();

let notes = [
    // ...
];

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
    response.json(notes);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```
- We are importing `express`.
    - This is a function used to create an express application stored inside `app` variable.
- Define two routes:
    - The first one defines an event handler.
        - Used to handle HTTP GET requests to the application's root `/`.
        - Event handler accepts two parameters.
            - The first `request` parameter contains all information of HTTP request.
            - The second `response` parameter defines how the request is responded to.
        - The request above is answered by using `send` method of `response` object.
            - Calling the `send` method, makes server respond by sending response containing string.
            - Parameter is string, so express sets value of `Content-Type` to `text/html`.
            - Status code of response defaults to 200.
    - The second defines an event handler that handles HTTP GET requests made to `notes` path of the app.
        - Responded with the `json` method of the `response` object.
        - Sends the `notes` array as a JSON formatted string.
- In earlier version using Node, we had to transform the data.
```javascript
response.end(JSON.stringify(notes));
```
- With express, it's not needed. Happens automatically.
- Note that `JSON` is a string.
    - This is NOT a JavaScript object like the value assigned to `notes`.
    - Experiment below shows:
```
> person
{ name: "Arto", age: 35 }
> const json = JSON.stringify(person)
undefined
> json
'{"name":"Arto","age":35}'
> typeof person
'object'
> typeof json
'string'
>
```
- Experiment in `node-repl`.
    - Start by typing `node` in the command line.
    - Useful for testing commands.


## nodemon
- In order to make and see changes to application code, we have to manually restart it.
    - This is different from React's auto reload feature we're used to.
- The solution is `nodemon`.
    - **nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.**
- Install `nodemon` by defining it as a `development dependency`.
```
$ npm install --save-dev nodemon
```
- The `package.json` also changes:
```json
{
    // ...
    "dependencies": {
        "express": "^4.17.2"
    },
    "devDependencies": {
        "nodemon": "^2.0.15"
    }
}
```
- If you accidentally did not install as a development dependency, just change it to the above manually.
- Development dependencies means tools that are needed only during development of the application.
    - Not needed when application is run in production mode on the production server (Heroku).
- Start app with `nodemon` like this:
```
$ node_modules/.bin/nodemon index.js
```
- Changes to application happen automatically.
- The command is too long, so let's define a dedicated `npm script` in `package.json`:
```json
{
    // ...
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    // ...
}
```
- No need to specify the whole path as you can see.
    - `npm` automatically knows to search for the file from that directory.
- Can now start the server in development mode using:
```
$ npm run dev
```
- Instead of:
```
$ npm start
```
- Notice that we have to add the word `run` inside the command unlike with `start` and `test` scripts.


## REST
- Expand app so that it provides same RESTful HTTP API as `json-server`.
- `REST` stands for `Representational State Transfer`.
    - An architectural style meant for building scalable web apps.
- We concern ourselves with how RESTful APIs are typically understood in web apps.
- Remember that singular things, like notes, are called `resources`.
    - Every resource has a URL which is unique to them.
- One convention is to combine name of resource type with the unique identifier.
- Assume root URL of our service is `www.example.com/api`.
    - Define resource type of note to be `notes`.
    - Address of note resource with `id` of 10 is `www.example.com/api/notes/10`.
- URL for collection of all resources is `www.example.com/api/notes`.
- Can execute different operations on resources.
    - Operation to be executed is defined by the HTTP `verb`.

URL | verb | functionality
------------ | ------------- | -------------
notes/10 | GET | fetches a single resource
notes | GET | fetches all resources in the collection
notes | POST | creates a new resource based on the request data
notes/10 | DELETE | removes the identified resource
notes/10 | PUT | replaces the entire identified resource with the request data
notes/10 | PATCH | replaces a part of the identified resource with the request data

- This is what's defined as a `uniform interface`.
    - Consistent way of defining interfaces that makes it possible for systems to cooperate.
- This way of interpreting REST falls under the `second level of RESTful maturity in the Richardson Maturity Model`.
- This might be represented as a `resource oriented architecture` instead of REST.


## Fetching A Single Resource
- Expand app so that it offers a REST interface for operating on individual notes.
- Create a `route` for fetching a single resource.
- Unique address is of the form `notes/10` where 10 is the `id` of the note.
- Define `parameters` for routes in express by using colon syntax.
```javascript
app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    const note = notes.find(note => note.id === id);
    response.json(note);
});
```
- The route above handles all requests of the form `/api/notes/SOMETHING` where `SOMETHING` is an arbitrary string.
- Notice we can access the `id` in the `request` object.
- We use the `find` method to find the note that matches the `id`.
- We return this note we found to the sender of the request as JSON.
- When we go to `http://localhost:3001/api/notes/1`, it's blank.
    - Let's use `console.log()` to find out why.
```javascript
app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    console.log(id);
    const note = notes.find(note => note.id === id);
    console.log(note);
    response.json(note);
});
```
- When we visit the page again, the `note` we "found" is `undefined`.
- We see it printed the correct `id`, but the `find` method does not find a matching note.
- Add logging inside the comparison function passed to `find`.
```javascript
app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    const note = notes.find(note => {
        console.log(note.id, typeof note.id, id, typeof id, note.id === id);
        return note.id === id;
    });
    console.log(note);
    response.json(note);
});
```
- Visit URL and see what's printed.
```
1 'number' '1' 'string' false
2 'number' '2' 'string' false
3 'number' '3' 'string' false
```
- We see that the `id` variable is a `string`.
- The notes' ids are all `integers`.
- The triple equals considers all values of different types to not be equal by default.
    - So, 1 is not "1".
- Fix this by changing `id` parameter from a `string` to a `number`.
```javascript
app.get("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    response.json(note);
});
```
- Now, fetching single resource works.
- Another problem.
    - If we search for a note with an `id` that does not exist, server responds with status 200 and content length of 0.
    - This means response succeeded.
    - There is no data sent back.
- This is because `note` variable is set to `undefined` if nothing matches.
- This needs to be handled in a better way.
    - Server should respond with status code `404 not found` instead of 200.
- Make the following changes:
```javascript
app.get("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);

    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});
```
- No data is attached to the response.
    - Use `status` method for setting the status.
    - Use `end` method for responding to request without sending any data.
- All JavaScript objects are truthy.
    - So, it evaluates to true, or `truthy`, in the if-statement if the `note` object is found.
    - The `undefined` value is `falsy`.
- The error is returned successfully when no `note` is found.
    - However, there's nothing to visually see this.
    - It's possible to give a clue about the reason of sending a 404 error.
        - Can override default NOT FOUND message.


## Deleting Resources
- Implement route for deleting resources.
    - Happens with HTTP DELETE request to the URL of the resource:
```javascript
app.delete("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
});
```
- If deleting resource is successful.
    - Means note exists and it is removed.
    - Respond to request with status code `204 no content`.
    - Return no data with the response.
- No consensus on what status code should be returned to a DELETE request if resource doesn't exist.
    - Only two options are `204` and `404`.
    - For simplicity, respond with `204` in both cases.


## Postman
- How do we test the delete operations?
- HTTP GET requests are easy from the browser.
- Tools exist to test this deletion in backend.
    - One of these is the command line program `curl`.
    - Instead of `curl`, we look at using `Postman` for testing the application.
- Install Postman and try it out.
    - Define the URL and then select the correct request type (DELETE).
- The backend server responds correctly.
- Make a GET request to `http://localhost:3001/api/notes` to see that the note is gone.
- Notes in application are only saved to memory.
    - List of notes will return on server restart.


## The Visual Studio Code REST Client
- If you use VSCode, you can use the VS Code `REST client` plugin instead of Postman.
- Make a directory at root of app named `requests`.
    - Save all REST client requests in the directory as files that end with the `.rest` extension.
- Create a new `get_all_notes.rest` file.
    - Define the request that fetches all notes.
```
GET http://localhost:3001/api/notes
```
- Click the `Send Request` text to execute it.




