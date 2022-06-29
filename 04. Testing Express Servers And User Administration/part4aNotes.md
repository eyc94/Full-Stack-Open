# Structure of Backend Application and Introduction To Testing
- Continue working on backend notes application.


## Project Structure
- Modify structure of project to adhere to Node.js best practices.
- We will end up with the following structure:
```
|-- index.js
|-- app.js
|-- build
|   |-- ...
|-- controllers
|   |-- notes.js
|-- models
|   |-- note.js
|-- package-lock.json
|-- package.json
|-- utils
|   |-- config.js
|   |-- logger.js
|   |-- middleware.js
```
- We have been using `console.log()` and `console.error()` to print different information.
    - Not a good way to do things.
    - Separate all printing to the console to its own module `utils/logger.js`:
```javascript
const info = (...params) => {
    console.log(...params);
};

const error = (...params) => {
    console.error(...params);
};

module.exports = {
    info, error
};
```
- The `logger` has two functions `info` and `error`.
    - Used for information and error printing.
- This is good practice.
    - If we wanted to write logs to a file or send them to an external logging service like `graylog` or `papertrail`, we would make changes in one place.
- Contents of `index.js` used for starting the application gets simplified as follows:
```javascript
const app = require("./app");   // The actual Express application.
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");

const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
```
- The `index.js` file only imports the actual application from `app.js` and then starts the application.
    - The `info` function of the logger-module is used for console printout telling that the application is running.
- Handling of environment variables is extracted into `utils/config.js` file:
```javascript
require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
    MONGODB_URI,
    PORT
};
```
- Other parts of app can access environment variables by importing `config` file:
```javascript
const config = require("./utils/config");

logger.info(`Server running on port ${config.PORT}`);
```
- Route handlers are moved to another module.
    - The event handlers are called `controllers`, so we create a new `controllers` folder.
    - All of the routes related to notes are now in the `notes.js` module under `controllers` folder.
- Contents of `notes.js`:
```javascript
const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

notesRouter.get("/:id", (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

notesRouter.post("/", (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    note.save()
        .then(savedNote => {
            response.json(savedNote);
        })
        .catch(error => next(error));
});

notesRouter.delete("/:id", (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

notesRouter.put("/:id", (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important
    };

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

module.exports = notesRouter;
```
- Notice we create a new `router` object.
    - `https://www.expressjs.com/en/api/html#router`
- The module exports the router to be available for use for all customers of module.
- Notice the paths in the route handlers are also shorted:
```javascript
app.delete("/api/notes/:id", (request, response) => {
    // ...
});

app.delete("/:id", (request, response) => {
    // ...
});
```
- Express manual provides the following explanation:
    - **A router object is an isolated instance of middleware and routes. You can think of it as a "mini-application" that is capable only of performing middleware and routing functions. Every Express application has a built-in app router.**
- The router is a `middleware`.
    - Used for defining `related routes` in a single place.
    - Typically placed in its own module.
- The `app.js` that creates the actual application takes the router into use:
```javascript
const notesRouter = require("./controllers/notes");
app.use("/api/notes", notesRouter);
```
- The router we defined is used *if* the URL of the request starts with `/api/notes`.
    - This is why the `notesRouter` object must define only the relative parts of the routes.
        - Like the empty path `/` or `/:id`.
- Our `app.js` now looks like:
```javascript
const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("Connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI);
    .then(() => {
        logger.info("Connected to MongoDB");
    })
    .catch((error) => {
        logger.error("Error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
```
- File uses different `middleware`.
    - One of these is `notesRouter` attached to the `/api/notes` route.
    - Custom middleware moved to `utils/middleware.js` module:
```javascript
const logger = require("./logger");

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "Malformatted ID" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};
```
- Responsibility to handle establishing connection to db is given to `app.js`.
- The `note.js` under `models` directory only defines the Mongoose schema for notes.
```javascript
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 5
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
});

noteSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model("Note", noteSchema);
```
- Establish some kind of structure once the app grows in size.
- Separate different responsibilities of app into different modules.


## Note On Exports
- We used two different kinds of exports in this part.
- The file `utils/logger.js` does the export as follows:
```javascript
const info = (...params) => {
    console.log(...params);
};

const error = (...params) => {
    console.error(...params);
};

module.exports = {
    info, error
};
```
- File exports an `object` that has two fields.
    - Both are functions.
- Functions can be used in two different ways:
    - First is to use dot notation and access functions through objects.
    - Second is to destructure the functions to its own variables in the `require` statement:
```javascript
// First way.
const logger = require("./utils/logger");

logger.info("message");
logger.error("error message");

// Second way.
const { info, error } = require("./utils/logger");

info("message");
error("error message");
```
- The second way is preferred only when a small portion of exported functions are used in a file.
- For example, in `controllers/notes.js`, it exports just one thing.
    - That's why when we use it, we just assign it to a variable in the require statement.


## Testing Node Applications
- Completely neglected automated testing.
- Look at `unit tests`.
    - App is small so not much we can test with unit tests.
- Create file `utils/for_testing.js`.
    - Write couple of simple functions that we can use for test writing practice:
```javascript
const reverse = (string) => {
    return string
        .split("")
        .reverse()
        .join("");
};

const average = (array) => {
    const reducer = (sum, item) => {
        return sum + item;
    };

    return array.reduce(reducer, 0) / array.length;
};

module.exports = {
    reverse,
    average
};
```
- The `average` function uses the array's `reduce` method.
    - `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce`
    - Should watch first three videos from `Funtional Javascript` series on YouTube.
        - `https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84`
- Many different testing libraries and `test runners` for JavaScript.
- We will use a testing library developed and used internally by Facebook called `jest`.
    - Resembles the previous king of testing libraries: `Mocha`.
    - Natural choice.
    - Works well with testing backends.
    - Shines for testing React applications.
- Tests are only executed during development, so install `jest` as a development dependency.
```
$ npm install --save-dev jest
```
- Define `npm script` for `test` to run tests with Jest.
```json
{
    // ...
    "scripts": {
        // ...
        "test": "jest --verbose"
    },
    // ...
}
```
- `Jest` requires setting the execution environment to Node.
    - Add the following to end of `package.json`.
```json
{
    // ...
    "jest": {
        "testEnvironment": "node"
    }
}
```
- Alternatively, Jest can look for a config file with the name `jest.config.js`.
    - Can define execution environment like this:
```javascript
module.exports = {
    testEnvironment: "node"
};
```
- Create separate directory for our tests called `tests`.
    - Create file called `reverse.test.js` with the following:
```javascript
const reverse = require("../utils/for_testing").reverse;

test("Reverse of a", () => {
    const result = reverse("a");
    expect(result).toBe("a");
});

test("Reverse of react", () => {
    const result = reverse("react");
    expect(result).toBe("tcaer");
});

test("Reverse of releveler", () => {
    const result = reverse("releveler");
    expect(result).toBe("releveler");
});
```
- The ESLint config we previously added is complaining about `test` and `expect` commands.
    - Our config does not allow `globals`.
    - Rid the complaints by adding `"jest": true` to the `env` property in `.eslintrc.js` file:
```javascript
module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true,
        "jest": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        // ...
    }
}
```
- The first line of our test file imports the `reverse` function and assigns to a variable called `reverse`.
- Individual test cases are defined with `test` function.
    - First parameter is description test as string.
    - Second parameter is a `function` that defines the functionality for the test case.
- First run the code to be tested.
- Then verify results with `expect` function.
    - Wraps the resulting value into an object that offers a collection of `matcher` functions.
    - Used for verifying correctness of result.
    - Since comparing two strings, we can use the `toBe` matcher.
- All tests should pass.
- Jest expects names of test files contain `.test`.
    - In this course, we follow convention of naming our tests files with extension `.test.js`.
- Can see what kind of error it gives with this:
```javascript
test("Palindrome of react", () => {
    const result = reverse("react");
    expect(result).toBe("tkaer");
});
```
- Add a few tests for `average` function into a new file `tests/average.test.js`.
```javascript
describe("Average", () => {
    test("of one value is the value itself", () => {
        expect(average([1])).toBe(1);
    });

    test("of many is calculated correctly", () => {
        expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
    });

    test("of empty array is zero", () => {
        expect(average([])).toBe(0);
    });
});
```
- The last test is an error because you cannot divide by zero!
    - Results in `NaN`.
- Fix function:
```javascript
const average = (array) => {
    const reducer = (sum, item) => {
        return sum + item;
    };

    return array.length === 0
        ? 0
        : array.reduce(reducer, 0) / array.length;
};
```
- If length of the array is 0, we return 0.
- Otherwise calculate the average.
- Notice how we defined a `describe` block around the tests that was given the name `average`.
- The `describe` block is good for grouping tests.
    - Logical collections.
    - Test output of Jest also uses name of describe block.
    - Necessary when we want to run some shared setup or teardown operations for a group of tests.
- Notice also how compact the tests are written.

