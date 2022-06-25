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



