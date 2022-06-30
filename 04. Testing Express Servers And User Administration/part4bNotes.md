# Testing The Backend
- Start writing tests for the backend.
- Current backend is not complicated.
    - Does not make sense to write `unit` tests for it.
    - We could write them for the `toJSON` method used for formatting notes.
- Some situations it's good to make some backend tests by mocking the database instead of using the real database.
    - One library that could be used for this is `mongodb-memory-server`.
- Backend application is really simple.
    - We will make the decision to test the entire application through its REST API.
    - Database is also included.
- Multiple components of a system being tested as a group is called `integration testing`.


## Test Environment
- When your backend server is running in Heroku, it is in `production` mode.
- Convention in Node is to define the execution mode of the app with the `NODE_ENV` environment variable.
    - In current app, we load the environment variables in `.env` if app is *not* in production mode.
- Common practice to define separate modes for testing and development.
- Change scripts in `package.json` so that when tests are run, `NODE_ENV` gets the value `test`:
```json
{
    // ...
    "scripts": {
        "start": "NODE_ENV=production node index.js",
        "dev": "NODE_ENV=development nodemon index.js",
        // ...
        "test": "NODE_ENV=test jest --verbose --runinBand"
    },
    // ...
}
```
- Added the `runInBand` option to the npm script that executes the test.
    - Prevents Jest from running tests in parallel.
    - Significance will be discussed when tests start using database.
- Defined `start` script as production and `dev` script as development.
- Issue with way we specified mode of app in our scripts.
    - Does not work on Windows.
    - Fix by installing `cross-env` package as a dev dependency.
```
$ npm install --save-dev cross-env
```
- Can now achieve cross-platform compatibility by using the cross-env library in our npm scripts defined in `packaged.json`.
```json
{
    // ...
    "scripts": {
        "start": "cross-env NODE_ENV=production node index.js",
        "dev": "cross-env NODE_ENV=development nodemon index.js",
        // ...
        "test": "cross-env NODE_ENV=test jest --verbose --runinBand"
    },
    // ...
}
```
- If deploying this app to Heroku, if `cross-env` is saved as a dev dependency, it would cause an app error.
    - Change cross-env to production dependency:
```
npm i cross-env -P
```
- Can now modify the way that our app runs in different modes.
    - We could define the app to use separate test database when it is running tests.
- Can create separate test database in MongoDB Atlas.
    - Not optimal when there are multiple people testing the same app.
    - Test execution requires that a single database is not used by tests that are running at the same time.
- Better to run tests using a database that is installed and running in developer's local machine.
    - Optimal solution is to have every test execution use its own separate database.
    - Simple to achieve by running `Mongo in-memory`.
        `https://www.mongodb.com/docs/manual/core/inmemory/`
    - Or by using `Docker` containers.
        `https://www.docker.com/`
    - We will just use the MongoDB Atlas database.
- Make changes to the module that defines the app's config.
```javascript
require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI = process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
    MONGODB_URI,
    PORT
};
```
- The `.env` file has separate variables for the database addresses of the development and test dbs:
```
MONGODB_URI=mongodb+srv://...
PORT=3001

TEST_MONGODB_URI=mongodb+srv//...
```
- The `config` module we made slightly looks like the `node-config` package.
    - Writing our own implementation is justified becaue the app is simple.
    - It also teaches us a good lesson.
- These are the only changes we need to make.


## supertest
- Use the `supertest` package to help write tests for testing the API.
- Install the package as a development dependency:
```
npm install --save-dev supertest
```
- Write our first test in `tests/note_api.test.js` file:
```js
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("Notes are returned as JSON", async () => {
    await api
        .get("/api/notes")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

afterAll(() => {
    mongoose.connection.close();
});
```
- The test imports the Express app from `app.js`.
    - Wraps this with `supertest` function into a `superagent` object.
    - This object is then assigned to the variable `api`.
    - Tests can use it for making HTTP requests to the backend.
- Our test makes an HTTP GET request to `/api/notes`.
    - Verifies the request is responded to with status code 200.
    - Test also verifies the `Content-Type` header is set to `application/json`.
    - Notice it's in the `RegEx` syntax.
- Notice the `async` and `await` keywords.
    - Do not be concerned with these for now.
    - Related to the fact that making a request to the API is an `asynchronous` operation.
    - The `async/await` syntax can be used for writing asynchronous code with the appearance of synchronous code.
- Once all tests run, we close the database connection used by Mongoose.
    - Use the `afterAll` method.
- You might run into this problem:
    - `Jest did not exit one second after the test run has completed`.
    - Caused likely by Mongoose version 6.x.
    - Problems do not occur with Mongoose version 5.x.
    - Mongoose documentation does not recommend testing Mongoose apps with Jest.
    - One way to rid the problem is to run tests with option `--forceExit`.
```json
{
    // ...
    "scripts": {
        "start": "cross-env NODE_ENV=production node index.js",
        "dev": "cross-env NODE_ENV=development nodemon index.js",
        "lint": "eslint .",
        "test": "cross-env NODE_ENV=test jest --verbose --runinBand --forceExit"
    },
    // ...
}
```
- Another error is that your test takes longer than the default Jest test timeout of 5000 ms (5s).
- Solved by adding third parameter to the test function:
```js
test("Notes are returned as JSON", async () => {
    await api
        .get("/api/notes")
        .expect(200)
        .expect("Content-Type", /application\/json/);
}, 100000);
```
- Long timeout ensures tests won't fail due to the time it takes to run.
- Important detail:
    - We extracted the application into the `app.js` file.
    - Role of `index.js` file was changed to launch the application at the port with Node's built-in `http` object.
```js
const app = require("./app");   // The actual Express application.
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");

const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
```
- The tests only use the express app defined in the `app.js` file:
```js
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

// ...
```
- Documentation for `supertest`:
    - **If the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports**.
    - Basically, supertest takes care that the app being tested is started at the port that it uses internally.
- Write a few more tests:
```js
test("There are two notes", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(2);
});

test("The first note is about HTTP methods", async () => {
    const response = await api.get("/api/notes");
    expect(response.body[0].content).toBe("HTML is easy");
});
```
- Both tests store response of request to the `response` variable.
    - Previous test used the methods provided by `supertest`.
    - Verifies status code and headers.
    - We are now looking at the response data stored in `response.body` property.
    - Tests verify the format and content of the response data with `expect` method of Jest.
- See how advantageous it is to use `async/await` syntax.
    - Normally, we use callback functions to access data returned by promises.
    - New syntax makes it more comfortable.
```javascript
const response = await api.get("/api/notes");

// Execution gets here only after the HTTP request is complete.
// The result of HTTP request is saved in variable response.
expect(response.body).toHaveLength(2);
```
- Our middleware logger outputs information that blocks the view of the test.
    - Modify logger so that it does not print to console in test mode.
```js
const info = (...params) => {
    if (process.env.NODE_ENV !== "test") {
        console.log(...params);
    }
}

const error = (...params) => {
    if (process.env.NODE_ENV !== "test") {
        console.error(...params);
    }
}

module.exports = {
    info, error
};
```


## Initializing The Database Before Tests
- Testing looks easy and tests are passing.
- However, tests are bad.
    - Dependent on state of the database.
- To make tests more robust, we have to reset the database and generate the needed test data in a controlled manner before we run the tests.
- Test already uses `afterAll` function to close connecton to db.
- Jest has many other functions.
    - Functions that can be used once before any test is run or every time before a test is run.
- Initialize db *before every test* with `beforeEach` function.
```js
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Note = require("../models/note");

const initialNotes = [
    {
        content: "HTML is easy",
        date: new Date(),
        important: false
    },
    {
        content: "Browser can execute only Javascript",
        date: new Date(),
        important: true
    }
];

beforeEach(async () => {
    await Note.deleteMany({});
    let noteObject = newNote(initialNotes[0]);
    await noteObject.save();
    noteObject = new Note(initialNotes[1]);
    await noteObject.save();
});

// ...
```
- The db is cleared out at the beginning.
- We save two notes stored in `initialNotes` array to the db.
    - This ensures db is in the same state before every test is run.
- Make the following changes to the last two tests:
```js
test("All notes are returned", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(initialNotes.length);
});

test("A specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map(r => r.content);
    expect (contents).toContain("Browser can execute only JavaScript");
});
```
- Notice that we use the `map` method to create an array called `contents` that holds the contents of every note.
- The `toContain` method is used to check that the note given as a parameter is in the list of notes returned by the API.



