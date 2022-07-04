# User Administration
- We want to add user authentication and authorization to our app.
- Users are stored in the database.
    - Every note should be linked to the user who created it.
    - Deleting and editing a note should be allowed to the user who created it.
- Add info about users to db.
    - One-to-many relationship between user (`User`) and notes (`Note`).
- In relational db, implementation is straightforward.
    - Both resources have their separate tables.
    - The id of the user who created a note would be stored in the notes table as a foreign key.
- Using document databases is different.
    - Many ways to model the situation.
- Existing solution saves every note in the `notes` collection in db.
    - If we don't want to change this existing solution, natural choice is to save users in their own collection.
    - Like `users`.
- Can use object id in Mongo to reference documents in other collections.
    - Similar to using foreign keys in relational db.
- Document dbs like Mongo don't support `join queries` that are in relational dbs.
    - Used for aggregating data from multiple tables.
    - Starting version 3.2, Mongo supported `lookup aggregation queries`.
        - Not taking a look at this functionality.
- If join queries are needed, we will implement it in our app code by making multiple queries.
    - Mongoose can take care of joining and aggregating data.
        - Gives appearance of join query.
    - Even in these situations, Mongoose makes multiple queries to the database in background.


## References Across Collections
- If using relational db, note would have a `reference key` to the user who created it.
- In document db, we can do the same thing.
- Assume `users` collection contains two users:
```js
[
    {
        username: "mluukkai",
        _id: 123456
    },
    {
        username: "hellas",
        _id: 141414
    }
];
```
- The `notes` collection has three notes that all have a `user` field that references a user in the `users` collection.
```js
[
    {
        content: "HTML is Easy",
        important: false,
        _id: 221212,
        user: 123456
    },
    {
        content: "The most important operations of HTTP protocol are GET and POST",
        important: true,
        _id: 221255,
        user: 123456
    },
    {
        content: "A propert dinosaur codes with Java",
        important: false,
        _id: 221244,
        user: 141414
    }
];
```
- Document dbs do not require the foreign key to be stored in the note resources.
    - Can also be stored in the `users` collection or even both.
```js
[
    {
        username: "mluukkai",
        _id: 123456,
        notes: [221212, 221255]
    },
    {
        username: "hellas",
        _id: 141414,
        notes: [221244]
    }
];
```
- Users can have many notes, so the related ids are stored in an array in the `notes` field.
- Document dbs also offer a different way of organizing data.
    - Might be beneficial to nest the entire notes array as a part of the documents in the users collection:
```js
[
    {
        username: "mluukkai",
        _id: 123456,
        notes: [
            {
                content: "HTML is Easy",
                important: false
            },
            {
                content: "The most important operations of HTTP protocol are GET and POST",
                important: true
            }
        ]
    },
    {
        username: "hellas",
        _id: 141414,
        notes: [
            {
                content: "A proper dinosaur codes with Java",
                important: false
            }
        ]
    }
];
```
- In the above schema, notes are tightly nested under users and db would not generate ids for them.
- Schema must be one which supports use cases of the app.
    - Design decision.
- Schemaless dbs like Mongo require making far more radical design decisions about data organization at the beginning of the project than relational dbs with schemas.
- Relational dbs offer a more or less suitable way of organizing data for many apps.


## Mongoose Schema For Users
- We make decision to store ids of the notes created by the user in the user document.
- Define the model for representing a user in `models/user.js` file:
```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // The passwordHash should not be revealed.
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```
- The ids of notes are stored in user document as an array of Mongo ids.
- Type of field is `ObjectId` that references `note`-style documents.
- Mongo does not know that this is a field that references notes.
    - Syntax related to and defined by Mongoose.
- Expand schema of note in `models/note.js` file.
    - Note should contain information about the user who created it.
```js
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 5
    },
    date: Date,
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
```
- References are now stored in both documents.
    - The note references the user who created it.
    - The user has an array of references to all of the notes created by them.


## Creating Users
- Implement a route for creating new users.
    - Unique `username`.
    - Has a `name`.
    - Has a `passwordHash`.
        - Output of a one-way hash function.
        - Applied to the user's password.
        - Never wise to store unencrypted plain text passwords in the db.
- Install the `bcrypt` package.
```
$ npm install bcrypt
```
- Creating new users happens in compliance with RESTful conventions.
    - Makes HTTP POST request to the `users` path.
- Define separate `router` for dealing with users in a new `controllers/users.js` file.
- Take router to use in `app.js` file.
    - Handles requests made to `/api/users` url.
```js
const usersRouter = require("./controllers/users");

// ...

app.use("/api/users", usersRouter);
```
- Contents of file that defines router is:
```js
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

module.exports = usersRouter;
```
- Password sent in request is not stored in db.
    - Store the hash of the password created with `bcrypt.hash` function.
- Fundamentals of storing password is not gone over in this course.
- We will not talk about the magic number 10 assigned to `saltRounds`.
    - Read more about it here: `https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds`
- Current code does not contain error handling or input validation for verifying that the username and password are in the desired format.
- Test the initial features manually with tool like Postman.
    - Testing manually will be too cumbersome.
    - Especially with unique usernames.
- Much less efforts to write automated tests.
- Initial tests could look like:
```js
const bcrypt = require("bcrypt");
const User = require("../models/user");

// ...

describe("When there is initially one user in db", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("sekret", 10);
        const user = new User({ username: "root", passwordHash });

        await user.save();
    });

    test("Creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "mluukkai",
            name: "Matti Luukkainen",
            password: "salainen"
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        
        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });
});
```
- Test above uses the `usersInDb()` helper function.
    - Implemented in `tests/test_helper.js` file.
    - Used to help us verify the state of db after a user is created:
```js
const User = require("../models/user");

// ...

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(u => u.toJSON());
};

module.exports = {
    initialNotes,
    nonExistingId,
    notesInDb,
    usersInDb
};
```
- The `beforeEach` adds a user with the username `root` to the db.
    - Write a new test that verifies a new user with the same username can not be created:
```js
describe("When there is initially one user in db", () => {
    // ...

    test("Creation fails with proper statuscode and message if username already taken", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "salainen"
        };

        const reuslt = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(result.body.error).toContain("username must be unique");

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });
});
```
- Test case does not pass.
    - Practicing `test-driven development (TDD)`.
    - Tests for new functionality are written before the funcitonality is implemented.
- Mongoose does not have a built-in validator for checking uniqueness of field.
    - Can find a ready-made solution from `mongoose-unique-validator` npm package.
        - Does not work with Mongoose version 6.x.
        - Implement uniqueness check ourselves in the controller.
```js
usersRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return response.status(400).json({
            error: "username must be unique"
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
});
```
- Implement other validations to user creation.
    - Can check username is long enough.
    - Can check the username consists of permitted characters.
    - Can check if the password is strong enough.
    - This is left as an optional exercise.
- Add initial implementation of a route handler that returns all of the users in the db:
```js
usersRouter.get("/", async (request, response) => {
    const users = await User.find({});
    response.json(users);
});
```
- Making new users in prod or dev, send a POST request to `/api/users` via Postman or REST client:
```json
{
    "username": "root",
    "name": "Superuser",
    "password": "salainen"
}
```


## Creating A New Note
- Code for creating new note must be updated so that the note is assigned to the user who created it.
- Expand current implementation.
    - Info about the user who created a note is sent in the `userId` field of the request body.
```js
const User = require("../models/user");

// ...

notesRouter.post("/", async (request, response, next) => {
    const body = request.body;

    const user = await User.findById(body.userId);

    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date(),
        user: user._id
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    response.json(savedNote);
});
```
- Worth noting that the `user` object also changes.
    - The `id` of the note is stored in the `notes` field.
- Try to create a note.
- The `id` of the users who created the notes can be seen when we visit the fetch all notes handler.


## Populate
- We would like to have our API work such that when an HTTP GET is made to `/api/users`, the user objects will also contain the contents of the user's notes.
    - Not just their ids.
- In relational dbs, the functionality would be implemented with a `join query`.
- Document dbs do not properly support join queries between collections.
    - Mongoose library can do some of these for us.
- Mongoose does multiple queries.
    - Different from join queries in relational db.
    - Relational dbs are `transactional`.
    - State of the db does not change during the time that the query is made.
- Join queries in Mongoose does not guarantee state between collections is consistent.
    - If we make a query that joins the user and notes collections, state of collections may change during the query.
    - Mongoose join is done with `populate` method.
    - Update route that returns all users:
```js
usersRouter.get("/", async (request, response) => {
    const users = await User
        .find({}).populate("notes");

    response.json(users);
});
```
- The `populate` method is chained after the `find` method making the initial query.
    - Parameter given to populate method defines that the `ids` referencing `note` objects in the `notes` field of the `user` document will be replaced by the referenced `note` documents.
- Result is almost exactly what we wanted.
- Can use the populate parameter for choosing the fields we want to include from documents.
    - Selection of fields is done with Mongo `syntax`:
```js
usersRouter.get("/", async (request, response) => {
    const users = await User
        .find({}).populate("notes", { content: 1, date: 1 });
    
    response.json(users);
});
```
- Now add a suitable population of user info to notes:
```js
notesRouter.get("/", async (request, response) => {
    const notes = await Note
        .find({}).populate("user", { username: 1, name: 1 });
    
    response.json(notes);
});
```
- User info is added to `user` field of note objects.
- Important to know that the db does not actually know that the ids stored in the `user` field of notes actually references documents in the user collection.
    - Functionality of `populate` is based on the fact that we defined "types" to the references in Mongoose schema with `ref` option.
```js
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 5
    },
    date: Date,
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
```


