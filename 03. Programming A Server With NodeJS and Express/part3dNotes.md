# Validation and ESLint
- Should be constraints applied to data stored in our database.
- Application should not accept notes that have a missing or empty `content` property.
- Validity of the note is checked in the route handler:
```javascript
app.post("/api/notes", (request, response) => {
    const body = request.body;
    if (body.content === undefined) {
        return response.status(400).json({ error: "Content missing" });
    }

    // ...
});
```
- If the note does not have the `content` property, respond to request with status code `400 bad request`.
- Better way to validate data format is to use the `validation` functionality available in Mongoose.
- Define specific validation rules for each field in schema:
```javascript
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
});
```
- The `content` is now required to be at least five characters long.
- The `date` field is set as required.
    - Cannot be missing.
    - Same applied to `content` field because the minimum length constraint allows the field to be missing.
- Not added constraints to `important`.
- The `minLength` and `required` validators are built-in and provided by Mongoose.
    - Mongoose allows us to create custom validator functionality.
- If we store object in db that breaks constraint, operation will throw an exception.
    - Change handler for creating new note so it passes any potential exceptions to the error handler middleware.
```javascript
app.post("/api/notes", (request, response, next) => {
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
```
- Expand error handler to deal with these validation errors:
```javascript
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "Malformatted ID" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};
```
- When validating fails, it returns the default error message from Mongoose.
- Validations are not done when editing a note.
    - Validations are not run by default when `findOneAndUpdate` is executed.
- Fix is easy. Reformulate route code a bit:
```javascript
app.put("/api/notes/:id", (request, response, next) => {
    const { content, important } = request.body;

    Note.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: "query" }
    )
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});
```


## Deploying The Database Backend To Production
- Generate new prod build of frontend.
- Environment variables defined in `dotenv` only used when backend is not in `production mode` (Heroku).
- Defined environment variables in `.env`.
    - However, define environment variables in Heroku for production.
```
heroku config:set MONGODB_URI=const url = mongodb+srv://exc:<password>@cluster0.jpep5cz.mongodb.net/noteApp?retryWrites=true&w=majority
```
- If it gives error, try wrapping the value with quotes.

