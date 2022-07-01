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


## Running Tests One By One
- The `npm test` command runs all tests of the app.
- When writing tests, it's wise to execute only one or two tests.
    - Can use the `only` method of Jest.
- If test is written across many files, this method is not good.
- Better option to specify test that needs to be run.
    - Parameter of `npm test` command.
- The following runs tests in the `tests/note_api.test.js` file.
```
$ npm test -- tests/note_api.test.js
```
- The `-t` option can be used for running tests with a specific name.
```
$ npm test -- -t "A specific note is within the returned notes"
```
- The parameter can be the name of the test or the describe block.
- Parameter can also contain just a part of the name.
- The following runs all tests that contain `notes` in their name.
```
$ npm test -- -t "notes"
```
- When running single test, mongoose connection might stay open if no tests using the connection are run.
    - Problem could be that `supertest` primes connection but Jest does not run the `afterAll` code.


## async/await
- Look at `async` and `await` keywords.
    - Introduced in ES7.
    - Makes it possible to use `asynchronous functions` that return a promise in a way that makes the code look synchronous.
- Fetching of notes from database with promises is:
```js
Note.find({}).then(notes => {
    console.log("Operation returned the following notes", notes);
});
```
- `Note.find()` returns a promise.
    - Access result of operation by registering a callback function with the `then` method.
    - If wanting to make several asynchronous function calls in order, this would be annoying.
    - Asynchronous calls have to be made in the callback.
    - Leads to complicated code and gives birth to `callback hell`.
- Can chain promises and keep situation under control.
    - Avoids callback hell.
    - Chain of `then` methods.
- See an articial example of a function that fetches all notes and deletes the first one.
```js
Note.find({})
    .then(notes => {
        return notes[0].remove();
    })
    .then(response => {
        console.log("The first note is removed");
        // More code here.
    });
```
- The then-chain is okay.
    - Can do better.
- The `generator functions` provide a clever way of writing asynchronous code in a way that looks synchronous.
    - Syntax clunky and not widely used.
- The `async` and `await` keywords were introduced in ES7.
    - Same functionality as generators.
    - But more understandable and syntactically cleaner.
- Fetch all of the notes in the database by using the `await` operator.
```js
const notes = await Note.find({});
console.log("Operation returned the following notes", notes);
```
- Code looks synchronous.
- Execution of code pauses at `const notes = await Note.find({});`.
    - Waits until related promise is *fulfilled*.
    - Continues its execution to the next line.
    - When execution continues, result of operation that returned a promise is assigned to the `notes` variable.
- The complicated example above can be represented like:
```js
const notes = await Note.find({});
const response = await notes[0].remove();

console.log("The first note is removed");
```
- Code is a lot simpler than the `then` chain.
- Important details:
    - To use `await` with asynchronous operations, they have to return a promise.
    - Not a problem because regular asynchronous functions using callbacks are easy to wrap around promises.
    - The `await` keyword can only be used inside of an `async` function.
- In order for the previous example to work, they have to be using async functions.
- Notice the first line of code below:
```js
const main = async () => {
    const notes = await Note.find({});
    console.log("Operation returned the following notes", notes);

    const response = await notes[0].remove();
    console.log("The first note is removed");
};

main();
```
- Code declares the function assigned to `main` is asynchronous.
- After, the code calls the function with `main()`.


## async/await in the Backend
- Change the backend to async and await.
- All of the asynchronous operations are done inside of a function.
    - It is enough to change the route handler functions into async functions.
- Route for fetching all notes is now:
```js
notesRouter.get("/", async (request, response) => {
    const notes = await Note.find({});
    response.json(notes);
});
```
- Verify refactoring worked by testing endpoint through browser.
    - Also run tests from earlier.


## More Tests and Refactoring The Backend
- When refactoring, there is a risk of `regression`.
    - Meaning functionality may break.
- Refactor remaining operations.
    - Write a test for each route of the API.
- Start with operation of adding new note.
    - Write test that adds new note.
    - Verify the amount of notes returned by the API increases.
    - Verify the newly added note is in the list.
```js
test("A valid notes can be added", async () => {
    const newNote = {
        content: "async/await simplifies making async calls",
        important: true
    };

    await api
        .post("/api/notes")
        .send(newNote)
        .expect(201)
        .expect("Content-Type", /application\/json/);
    
    const response = await api.get("/api/notes");

    const contents = response.body.map(r => r.content);

    expect(response.body).toHaveLength(initialNotes.length + 1);
    expect(contents).toContain("async/await simplifies making async calls");
});
```
- Notice that the test fails.
    - Because we are sending a 200 OK response code when a new note is created.
    - Change that to 201 CREATED.
```js
notesRouter.post("/", (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    note.save()
        .then(savedNote => {
            response.status(201).json(savedNote);
        })
        .catch(error => next(error));
});
```
- Write a test that verifies that a note without content will not be saved to the db.
```js
test("A note without content is not added", async () => {
    const newNote = {
        important: true
    };

    await api
        .post("/api/notes")
        .send(newNote)
        .expect(400);
    
    const response = await api.get("/api/notes");
    expect(response.body).toHavelength(initialNotes.length);
});
```
- Both tests check state stored in db after the saving operation.
    - Fetches all notes of the app.
- Same verifications will repeat in other tests later.
    - Good idea to extract these steps into helper functions.
- Add the function into a new file called `tests/test_helper.js`.
    - Same directory as the test file.
```js
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

const nonExistingId = async () => {
    const note = new Note({ content: "willremovethissoon", date: new Date() });
    await note.save();
    await note.remove();

    return note._id.toString();
};

const notesInDb = async () => {
    const notes = await Note.find({});
    return notes.map(note => note.toJSON());
};

module.exports = {
    initialNotes, nonExistingId, notesInDb
};
```
- Module defines the `notesInDb` function.
    - Can be used for checking the notes stored in db.
- The `initialNotes` array containing initial db state is also stored in the module.
- We define a `nonExistingId` function ahead of time.
    - Use for creating a db object ID that does not belong to any note object in db.
- Tests can now use helper module and be changed like this:
```js
const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Note = require("../models/note");

beforeEach(() => {
    await Note.deleteMany({});

    let noteObject = new Note(helper.initialnotes[0]);
    await noteObject.save();

    noteObject = new Note(helper.initialNotes[1]);
    await noteObject.save();
});

test("Notes are returned as JSON", async () => {
    await api
        .get("/api/notes")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("All notes are returned", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(helper.initialNotes.length);
});

test("A specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map(r => r.content);
    expect(contents).toContain("Browser can execute only JavaScript");
});

test("A valid note can be added", async () => {
    const newNote = {
        content: "async/await simplifies making async calls",
        important: true
    };

    await api
        .post("/api/notes")
        .send(newNote)
        .expect(201)
        .expect("Content-Type", /application\/json/);
    
    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map(n => n.content);
    expect(contents).toContain("async/await simplifies making async calls");
});

test("Note without content is not added", async () => {
    const newNote = {
        important: true
    };

    await api
        .post("/api/notes")
        .send(newNote)
        .expect(400);
    
    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

afterAll(() => {
    mongoose.connection.close();
});
```
- Code using promises works and tests passes.
    - Ready to refactor to use the async/await syntax.
- Make the following changes to the code that takes care of adding new note.
    - Notice the route handler definition is preceded by the `async` keyword.
```js
notesRouter.post("/", async (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    const savedNote = await note.save();
    response.status(201).json(savedNote);
})
```
- We have a problem.
    - No error handling.
    - How do we deal with this?


## Error Handling and the async/await
- If there is an exception while handling POST request, we end up with an error.
- We end up with an unhandled promise rejection.
    - The request never receives a response.
- With async/await, the recommended way of dealing with exceptions is the `try/catch` mechanism.
```js
notesRouter.post("/", async (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    try {
        const savedNote = await note.save();
        response.status(201).json(savedNote);
    } catch (exception) {
        next(exception);
    }
});
```
- Now our tests pass again.
- Write tests for fetching and removing an individual note:
```js
test("A specific note can be viewed", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToView = notesAtStart[0];

    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
    expect(resultNote.body).toEqual(processedNoteToView);
});

test("A note can be deleted", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api
        .delete(`/api/notes/${notesToDelete.id}`)
        .expect(204);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map(r => r.content);
    expect(contents).not.toContain(noteToDelete.content);
});
```
- Both tests share similar structure.
    - Initialization phase fetches a note from db.
    - Tests then call operation being tested.
    - Tests verify outcome is as expected.
- In first test.
    - The note we receive as response body goes through JSON serialization and parsing.
    - Processing turns the note object's `date` property value's type from `Date` object to string.
    - So, we cannot directly compare equality of `resultNote.body` and `noteToView` read from db.
    - Must first do similar JSON serialization and parsing for `noteToView` as server is performing for the note object.
- Tests pass and can safely refactor routes to use async/await:
```js
notesRouter.get("/:id", async (request, response, next) => {
    try {
        const note = await Note.findById(request.params.id);
        if (note) {
            response.json(note);
        } else {
            response.status(404).end();
        }
    } catch (exception) {
        next(exception);
    }
});

notesRouter.delete("/:id", async (request, response, next) => {
    try {
        await Note.findByIdAndRemove(request.params.id);
        response.status(204).end();
    } catch (exception) {
        next(exception);
    }
});
```


## Eliminating the try-catch
- async/await unclutters code.
- The price of using it is the `try/catch` structure required for catching exceptions.
- All route handlers follow this:
```js
try {
    // Do the async operations here.
} catch (exception) {
    next(exception);
}
```
- Can we refactor the code to eliminate the `catch` from the methods?
- The `express-async-errors` library has a solution:
```
$ npm install express-async-errors
```
- Introduce library in `app.js`.
```js
const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

// ...

module.exports = app;
```
- Magic of library allows us to eliminate try-catch blocks completely.
- The route for deleting the note right now is:
```js
notesRouter.delete("/:id", async (request, response, next) => {
    try {
        await Note.findByIdAndRemove(request.params.id);
        response.status(204).end();
    } catch (exception) {
        next(exception);
    }
});
```
- Now it becomes:
```js
notesRouter.delete("/:id", async (request, response) => {
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
});
```
- The library allows us to not need `next(exception)` anymore.
    - Handles everything under the hood.
    - If exception occurs in an *async* route, exception is automatically passed to the error handling middleware.
- The other routes are now:
```js
notesRouter.post("/", async (request, response) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    const savedNote = await note.save();
    response.json(savedNote);
});

notesRouter.get("/:id", async (request, response) => {
    const note = await Note.findById(request.params.id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});
```


## Optimizing The beforeEach Function
- Return to writing our tests and take closer look at `beforeEach` function that sets up tests.
```js
beforeEach(async () => {
    await Note.deleteMany({});

    let noteObject = new Note(helper.initialNotes[0]);
    await noteObject.save();

    noteObject = new Note(helper.initialNotes[1]);
    await noteObject.save();
};
```
- The code above saves the first two notes of `helper.initialNotes` array into db with two separate calls.
- Better way of saving multiple objects to db.
```js
beforeEach(async () => {
    await Note.deleteMany();
    console.log("CLEARED");

    helper.initialNotes.forEach(async (note) => {
        let noteObject = new Note(note);
        await noteObject.save();
        console.log("SAVED");
    });
    console.log("DONE");
});

test("Notes are returned as JSON", async () => {
    console.log("Entered test");
    // ...
});
```
- Saved notes in db with the `forEach` method of array using a loop.
- Tests don't seem to work, so we added logs.
- Console displays this:
```
cleared
done
entered test
saved
saved
```
- Notice that even if we use `async/await` syntax, the test executes before notes are saved to db.
- The reason is that every iteration of `forEach` loop generates its own asynchronous operation.
    - The `beforeEach` function will not wait for them to finish executing.
    - The `await` commands defined inside for each `forEach` loop are not in the `beforeEach` function.
    - They are in separate functions that `beforeEach` will not wait for.
- One fix is to wait for all of the asynchronous operations to finish running with the `Promise.all` method:
```js
beforeEach(async () => {
    await Note.deleteMany({});

    const noteObjects = helper.initialNotes
        .map(note => new Note(note));
    const promiseArray = noteObjects.map(note => note.save());
    await Promise.all(promiseArray);
});
```
- Solution is advanced even though it looks simple.
- The `noteObjects` array is created with `Note` constructor for each note in the `helper.initialNotes` array.
- Then, it creates a new array that holds `promises` created by calling `save` method on each item in `noteObjects` array.
    - Array of promises for saving each item to db.
- The `Promise.all` method transforms an array of promises to a single promise.
    - This will be fulfilled once every promise in the array passed to it as a parameter is resolved.
- The last line `await Promise.all(promiseArray);` waits that every promise for saving a note is finished.
    - This means that the db has been initialized.
- Returned values of each promise in the array can still be accessed when using `Promise.all`.
    - If we wait for the promises to be resolved with the `await` syntax `const results = await Promise.all(promiseArray);`, operation will return an array that contains the resolved values for each promise in the `promiseArray`.
    - Appears in same order as promises in array.
- `Promise.all` executes the promises it receives in parallel.
    - If they need to be run in a particular order, we have a problem.
    - Situations like this, the operations can be run inside of a `for...of` block.
    - Guarantees a specific execution order.
```js
beforeEach(async () => {
    await Note.deleteMany({});

    for (let note of helper.initialNotes) {
        let noteObject = new Note(note);
        await noteObject.save();
    }
});
```
- Important to pay attention to asynchronous behavior.

