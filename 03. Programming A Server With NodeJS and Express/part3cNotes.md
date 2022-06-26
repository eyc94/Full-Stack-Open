# Saving Data To MongoDB
- Take a look at ways of debugging Node apps again.


## Debugging Node Applications
- Use the `console.log()` method.


## Visual Studio Code
- Can start debugging with F5 key.
- Can set breakpoints.


## Chrome Dev Tools
- Debugging possible with Chrome developer console.
- Start app by:
```
node --inspect index.js
```


## Question Everything
- Many potential areas for bugs.
- When problem occurs, find out where it occurs.
- Question everything!


## MongoDB
- If you want notes to be stored indefinitely, we need a database.
- `MongoDB` is a `document database`.
- Lower complexity with respect to relational database.
- Document databases differ from relational databased in how they organize data and the query language they support.
- Document databases are categorized under the `NoSQL` umbrella term.
- Read chapters on `collections` and `documents` from MongoDB manual.
- We will use A MongoDB provider called `MongoDB Atlas`.
- Create account and select free.
- Click cloud provider and click `Create Cluster`.
- Use `security` tab to create user credentials for database.
    - Used by application to connect to db.
- Define IP addresses allowed to access the db.
    - All access from all IP addresses.
- Click `Connect`.
    - Choose `Connect your application`.
- We see a `MongoDB URI`.
    - This is the address of the database that we supply to MongoDB client library that we will add to our application.
- Address looks like:
    - `mongodb+srv://fullstack:$<password>@cluster0.o1opl.mongodb.net/<db_name>?retryWrites=true&w=majority`
- Can use db directly from our JS code with official `MongoDb Node.js driver`.
    - We use `Mongoose` library instead.
    - Higher level API.
- Install `Mongoose`.
```
$ npm install mongoose
```
- Do not add code dealing with Mongo to our backend just yet.
- Make a practice application by creating new file `mongo.js`.
```javascript
const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/<db_name>?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

const Note = mongoose.model("Note", noteSchema);

mongoose
    .connect(url)
    .then((result) => {
        console.log("Connected");

        const note = new Note({
            content: "HTML is easy",
            date: new Date(),
            important: true
        });

        return note.save();
    })
    .then(() => {
        console.log("Note saved!");
        return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
```
- Assumes password is sent as a parameter in command line arguments.
- When command `node mongo.js password` is run, it will create a new document to the database.
- Special characters in password means you need to URL encode it.
- View current state of db from MongoDB Atlas from `Browse Collections` button.
    - The document matching the note has been added to the `notes` collection in `<db_name>` database.
- Destroy default db and change name of db to `noteApp` by modifying the URI.
    - `mongodb+srv://fullstack:$<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`
- Run code again, and the data is now stored in the correct db.


## Schema
- After connection is established, define `schema` for a note and the matching `model`:
```javascript
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

const Note = mongoose.model("Note", noteSchema);
```
- First define `schema` of a note stored in `noteSchema` variable.
- The schema tells Mongoose how note objects are stored in db.
- In model definition, the first "Note" parameter is the singular name of the model.
    - Name of collection will be lowercased plural `notes`.
    - Mongoose convention is to automatically name collections as the plural (like `notes`) when schema refers to them in the singular (like `Note`).
- Document databases like Mongo are `schemaless`.
    - Database does not care about structure of data stored in the database.
    - Possible to store documents with different fields in same collection.
- Idea of Mongoose is that data stored in database is given a schema at the level of the application.
    - Defines the shape of the documents stored in any given collection.


## Creating and Saving Objects
- Application creates a new note object with the help of `Note` model.
```javascript
const note = new Note({
    content: "HTML is easy",
    date: new Date(),
    important: false
});
```
- Models are `constructor` functions.
    - Creates new JavaScript objects based on provided parameters.
    - They have all properties of the model like the method for saving the object to the database.
- Saving objects to database happen with the `save` method.
    - Provided with an event handler with the `then` method.
```javascript
note.save().then(result => {
    console.log("note saved!");
    mongoose.connection.close();
});
```
- When object is saved to the database, the event handler provided to `then` is called.
    - This event handler closes the database connection with `mongoose.connection.close()`.
    - If connection is not closed, the program will never finish its execution.
- Result of `save` is the `result` parameter of event handler.
    - Result is uninteresting when storing one object.
- Save a few more notes.


## Fetching Objects From The Database
- Comment out code for making new notes and replace it with the following:
```javascript
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note);
    });
    mongoose.connection.close();
});
```
- Program then prints all the notes stored in the database.
- Objects retrieved with the `find` method of the `Note` model.
- Parameter of method is object expressing search conditions.
    - Empty object `{}` means we get all notes stored in `notes` collection.
    - Search conditions adhere to Mongo search query `syntax`.
- Can restrict our search to only include important notes:
```javascript
Note.find({ important: true }).then(result => {
    // ...
});
```


## Backend Connected To A Database
- Can now use Mongo in our backend application.
- Copy and paste the Mongoose definition to `index.js`.
```javascript
const mongoose = rqeuire("mongoose");

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = `mongodb+srv://exc:<some_password>@cluster0.jpep5cz.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

const Note = mongoose.model("Note", noteSchema);
```
- Change handler for fetching all notes to:
```javascript
app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});
```
- Verify in the browser that the backend works for displaying all of the documents.
- Frontend assumes every object has a unique id in the `id` field.
    - Don't want to return the mongo versioning field `__v` to the frontend.
- Format objects returned by Mongoose.
    - Modify the `toJSON` method of schema.
    - Used on all instances of models produced with that schema.
    - Modify method:
```javascript
noteSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
```
- The `_id` looks like a string but it's an object.
- The method above transforms `_id` to string just in case.
- Respond to HTTP request with a list of objects formatted with the `toJSON` method:
```javascript
app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});
```
- The `notes` variable is assigned to array of objects returned by Mongo.
- When response is sent in JSON format, the `toJSON` method of each object in the array is called automatically by the `JSON.stringify` method.


## Database Configuration Into Its Own Module
- Extract Mongoose specific code into its own module.
- Create a new folder for the module called `models`.
    - Add a file called `note.js`.
```javascript
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose.connect(url)
    .then(result => {
        console.log("Conncted to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error.message);
    });

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
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
- Notice how defining Node modules is different than ES6 modules.
- Public interface of the module is defined by setting a value to the `module.exports` variable.
    - Set value to be `Note` model.
    - Variables like `mongoose` and `url` are not accessible or visible to users of the module.
- Import model to `index.js`:
```javascript
const Note = require("./models/note");
```
- `Note` variable will be assigned to the same object that the module defines.
- Notice how the connection is made is changed a bit.
- Not a good idea to hard-code address of dataabase in code.
    - Instead the address is passed as an environment variable `MONGODB_URI`.
- The method for making a connection with Mongo is given functions for dealing with success and failure of connection.
- Many ways to define environment variables:
    - One is to define it when the app is started.
```
MONGODB_URI=address_here npm run dev
```
- More sophisticated way is to use `dotenv` library.
    - Install it:
```
$ npm install dotenv
```
- Create a `.env` file at the root.
    - Environment variables are defined inside of the file:
```
MONGODB_URI=mongodb+srv://exc:${password}@cluster0.jpep5cz.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```
- The `.env` file should be ignored right away.
- Environment variables can be used with `require("dotenv").config();`.
- Reference them like you would normally.
    - Like `process.env.MONGODB_URI`.
- Change `index.js`:
```javascript
require("dotenv").config();
const express = require("express");
const app = express();
const Note = require("./models/note");

// ...

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```
- Important to have `dotenv` imported before the `note` model is imported.
    - Ensures env var from the `.env` file is available globally before code from other modules.
- Need to set env var yourself in Heroku.
    - Database URL and PORT.
- Or set it in the command line for Heroku:
    - `heroku config:set MONGODB_URI='const url = mongodb+srv://exc:${password}@cluster0.jpep5cz.mongodb.net/noteApp?retryWrites=true&w=majority`


## Using Database In Route Handlers
- Change the rest of the backend functionality to use the database.
- Creating new note is like this:
```javascript
app.post("/api/notes", (request, response) => {
    const body = request.body;

    if (body.content === undefined) {
        return response.status(400).json({ error: "content missing" });
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    note.save().then(savedNote => {
        response.json(savedNote);
    });
});
```
- The note objects are created with `Note` constructor function.
    - Response sent in the callback function for `save` function.
    - Ensures response sent only if operation succeeded.
    - Error handling discussed later.
- The `savedNote` parameter of callback is the saved and newly created note.
    - Data sent back in response is the formatted version created with the `toJSON` method:
```javascript
response.json(savedNote);
```
- Using Mongoose's `findById` method, change fetching an individual note.
```javascript
app.get("/api/notes/:id", (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    });
});
```


## Verifying Frontend and Backend Integration
- When backend gets expanded, it's good to test backend first.
- Then we test the frontend works with backend.
- Implement one functionality at a time.
- Once we introduce database, it's good to check the state persisted in the database.


## Error Handling
- If we tried to access a note with an id that does not exist, it will return `null`.
- Change behavior:
    - If note with given id does not exist, server will respond to request with HTTP status code 404 not found.
- Implement simple `catch` block to handle cases where promise returned by `findById` method is `rejected`.
```javascript
app.get("/api/notes/:id", (request, response) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).end();
        });
});
```
- If no matching note is found, value of `note` is `null`, and the `else` block will run.
    - Results in 404.
- If promise returned by `findById` fails, response will have status code 500 internal server error.
- Another error situation other than non-existing note.
    - Fetching note with wrong kind of `id`.
    - An `id` that does not match the Mongo identifier format.
- Given malformed id as an argument, `findById` will throw an error causing the returned promise to be rejected.
    - Causes callback in `catch` block to be called.
- Make adjustment to fetching single resource.
```javascript
app.get("/api/notes/:id", (request, response) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            console.log(error);
            response.status(400).send({ error: "malformatted id" });
        });
});
```
- If format of id is incorrect, we end up in the error handler in the `catch` block.
    - Status code is `400 Bad Request`.
        - **The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.**
- When using Promises, it's a good idea to use error handling/exception.
- Never bad idea to print object that caused the exception to the console in error handler.


## Moving Error Handling Into Middleware
- Right now, error handler code is in the rest of the code.
- Better to implement all error handling in a single place.
- Change handler for `/api/notes/:id` route.
    - It passes the error forward with the `next` function.
    - The `next` function is passed to handler as third parameter.
```javascript
app.get("/api/notes/:id", (request, response, next) => {
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
```
- The error is given to `next` function as a parameter.
    - If no parameter, execution moves to next route or middleware.
    - If `next` function is called with parameter, then execution will continue to `error handler middleware`.
- Express `error handlers` are middleware defined with a function that accepts four parameters.
    - Error handler looks like this:
```javascript
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "Malformatted ID" });
    }

    next(error);
};

// This has to be the last loaded middleware.
app.use(errorHandler);
```
- The error handler checks if error is a `CastError` exception.
    - This means invalid object id for Mongo.
    - Then the handler will send a response to browser with response object passed as a parameter.
- All other situations, the handler passes the error forward to the default Express error handler.
- Error handling middleware has to be the last loaded middleware!


## The Order Of Middleware Loading
- Execution order of middleware is same as the order that they are loaded into express with `app.use` function.
- Be careful when defining middleware.
- The correct order:
```javascript
app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);

app.post("/api/notes", (request, response) => {
    const body = request.body;
    // ...
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

// Handler of requests with unknown endpoint.
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    // ...
};

// Handler of requests with result to errors.
app.use(errorHandler);
```
- `json-parser` should be among the first!
- If `requestLogger` or `app.post` came first, the `request.body` is undefined!
- Important that the middleware for handling unsupported routes is next to the last middleware that is loaded into Express.
    - Before the error handler.
- The following order would result in an issue:
```javascript
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

// Handler of requests with unknown endpoints.
app.use(unknownEndpoint);

app.get("/api/notes", (request, response) => {
    // ...
});
```



