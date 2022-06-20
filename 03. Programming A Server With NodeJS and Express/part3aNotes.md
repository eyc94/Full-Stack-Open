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


