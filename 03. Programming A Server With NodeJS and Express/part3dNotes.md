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


## Lint
- Important tool called `lint`.
    - **Generically, lint or linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.**
- In JavaScript, the leading tool for static analysis (`linting`) is `ESlint`.
- Install ESlint as a development dependency to the backend repo:
```
$ npm install eslint --save-dev
```
- We can then initialize a default ESlint configuration with the command:
```
$ npx eslint --init
```
- Answer all questions:
    1. How would you like to use ESLint? To check syntax, find problems, and enforce code style.
    2. What type of modules does your project use? CommonJS (require/exports).
    3. Which framework does your project use? None of these.
    4. Does your project use TypeScript? No.
    5. Where does your code run? Node.
    6. How would you like to define a style for your project? Answer questions about your style.
    7. What format do you want your config file to be in? JavaScript.
    8. What style of indentation do you use? Spaces.
    9. What quotes do you use for strings? Double.
    10. What line endings do you use? Unix.
    11. Do you require semicolons? Yes.
- Configs saved in `.eslintrc.js` file.
```javascript
module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
```
- Immediately change indentation rule to your choice (4).
```javascript
"indent": [
    "error",
    4
]
```
- Inspectin and validating a file like `index.js` is done with:
```
npx eslint index.js
```
- Recommended to separate `npm script` for linting:
```json
{
    // ...
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        // ...
        "lint": "eslint ."
    },
    // ...
}
```
- `npm run lint` will check every file in the project.
- Files in the `build` directory get checked when command is run.
    - Don't want this.
    - Create a `.eslintignore` file in root of project.
    - Add the following:
```
build
```
- ESlint will not check `build`.
- Better alternative to executing linter from CLI is to configure a `eslint-plugin` to the editor.
    - Runs linter continuously.
    - Visual Studio ESLint plugin.
- Change the rules of ESlint by changing up `.eslintrc.js` file.
- Add `eqeqeq` rule that warns us.
    - If equality is checked with anything but triple equals.
    - Added under the `rules` field in config file.
```javascript
{
    // ...
    "rules": {
        // ...
        "eqeqeq": "error"
    }
}
```
- Make a few more changes to the rules.
    - Prevent unnecessary trailing spaces at the end of lines.
    - Require there is a space before and after curly braces.
    - Demand consisten use of whitespaces in function parameters of arrow functions.
```javascript
{
    // ...
    "rules": {
        // ...
        "eqeqeq": "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
            "error", "always"
        ],
        "arrow-spacing": [
            "error", { "before" true, "after": true }
        ]
    }
}
```
- Default config takes predetermined rules into use from `eslint:recommended`.
- Includes a rule that warns about `console.log` commands.
- Disabling a rule can be done by defining its value to be 0 in the config file.
- Do this for the `no-console` rule:
```javascript
{
    // ...
    "rules": {
        // ...
        "eqeqeq": "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
            "error", "always"
        ],
        "arrow-spacing": [
            "error", { "before" true, "after": true }
        ],
        "no-console": 0
    }
}
```
- After making changes to config, recommended to run linter from CLI.
    - Verifies config file is correctly formatted.
- Recent projects have adopted `Airbnb JavaScript Style Guide`.
    - `https://www.github.com/airbnb/javascript`
    - `https://www.github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb`

