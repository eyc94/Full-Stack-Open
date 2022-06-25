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


