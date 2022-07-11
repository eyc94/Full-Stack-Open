# End To End Testing
- So far, we tested backend as a whole on an API level using integration tests.
- We tested frontend components using unit tests.
- Look into another way to test the **system as a whole** using `End to End (E2E) tests`.
- We can do E2E testing of a web app using a browser and a testing library.
    - Multiple libraries like `Selenium`.
        - Can be used with almost any browser.
    - Another browser option are `headless browsers`.
        - These are browsers with no GUI.
        - Chrome can be used in headless mode.
    - E2E is the most useful category of tests.
        - They test the system through the same interface as real users use.
    - More challenging to configure than integration and unit tests.
    - Quite slow.
        - Large systems can have minutes to hours of execution time.
        - Need to be able to run tests as often as possible in case of code `regressions`.
    - E2E can also be `flaky`.
        - Some tests might pass one time and fail another even if no change in code.

    
## Cypress
- The E2E library `Cypress` is popular.
- Easy to use compared to `Selenium`.
- Its operating principle is different than most E2E testing libraries.
- Run completely within the browser.
    - Other libraries run tests in a Node-process connected to browser through an API.
- Make some end to end tests for our note application.
- Install `Cypress` to the frontend as a development dependency.
```
$ npm install --save-dev cypress
```
- Add an npm script to run it:
```json
{
    // ...
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "server": "json-server -p3001 db.json",
        "cypress:open": "cypress open"
    },
    // ...
}
```
- Unlike frontend unit tests, Cypress can be in the frontend, backend, or in their own separate repo.
- Tests require the tested system to be running.
- Unlike backend integration tests, Cypress tests do not start the system when they are run.
- Add npm script to backend which starts it in test mode.
```json
{
    // ...
    "scripts": {
        "start": "NODE_ENV=production node index.js",
        "dev": "NODE_ENV=development nodemon index.js",
        "build:ui": "rm -rf build && cd ../Full-Stack-Open/05.\\ Testing\\ React\\ Apps/notes-frontend/ && npm run build && cp -r build ../../../Notes-Backend",
        "deploy": "git push heroku master",
        "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",
        "logs:prod": "heroku logs --tail",
        "lint": "eslint .",
        "test": "NODE_ENV=test jest --verbose --runInBand --forceExit",
        "start:test": "cross-env NODE_ENV=test node index.js"
    },
    // ...
}
```
- When both backend and frontend are running, start Cypress with:
```
$ npm run cypress:open
```
- When first running `Cypress`, it creates a `cypress` folder.
- Creates an integration subdirectory where we place our tests.
- Cypress creates example tests in two subfolders:
    - The `integration/1-getting-started` directory.
    - The `integration/2-advanced-examples` directory.
- Delete both and make our own test file `note_app.spec.js`.
```js
describe("Note App", function () {
    it("Front page can be opened", function () {
        cy.visit("http://localhost:3000");
        cy.contains("Notes");
        cy.contains("Note App, EC 2022");
    });
});
```
- Start the test from the opened window.
- Might need to restart Cypress after deleting the example tests.
- If using Cypress ^10.1.0, `integration` subfolder is gone and replaced with `e2e` subfolder.
    - This is due to introduction of component testing.
- Recommended to name E2E test file with convention `note_app.cy.js` but you can specify any pattern using `specPattern` option in `cypress.config.js` file.
- Running test opens browser and shows how app behaves as the test is run.
- Structure of tests is familiar.
- Use of `describe` blocks to group different test cases like Jest does.
- Test cases defined with `it` method.
    - Cypress borrowed this from `Mocha` testing library it uses under the hood.
- The `cy.visit` and `cy.contains` are Cypress commands.
    - `cy.visit` opens the web address given to it as a parameter in the browser used by the test.
    - `cy.contains` searches for the string it received as a parameter from the page.
- Can declare test using an arrow function like:
```js
describe("Note App", () => {
    it("Front page can be opened", () => {
        cy.visit("http://localhost:3000");
        cy.contains("Notes");
        cy.contains("Note App, EC 2022");
    });
});
```
- Mocha recommends arrow functions are not used.
    - Might cause issues in certain situations.
- If `cy.contains` does not find the text we are looking for, it fails.


## Writing To A Form
- Extend tests so that the test tries to log into our application.
- Assume our backend contains a user with username `username` and password `password`.
- Test begins by opening login form:
```js
describe("Note App", function () {
    // ...

    it("Login form can be opened", function () {
        cy.visit("http://localhost:3000");
        cy.contains("Login").click();
    });
})
```
- Test searches for login button by its text.
- Clicks the button with `cy.click`.
- Our tests start the same way.
    - Open page `http://localhost:3000`.
    - Separate the shared part into a `beforeEach` block run before each test.
```js
describe("Note App", function () {
    beforeEach(function () {
        cy.visit("http://localhost:3000");
    });

    it("Front page can be opened", function () {
        cy.contains("Notes");
        cy.contains("Note App, EC 2022");
    });

    it("Login form can be opened", function () {
        cy.contains("Login").click();
    });
});
```
- The login field contains two `input` fields.
    - The test should write into it.
    - The `cy.get` command allows for searching for elements by CSS selectors.
    - Can access first and last input field on page.
    - Write to then with `cy.type`:
```js
it("User can login", function () {
    cy.contains("Login").click();
    cy.get("input:first").type("username");
    cy.get("input:last").type("password");
});
```
- The test works.
- The only problem is is that it relies on the fact that there are only two input fields.
    - If you add more, the `first` and `last` tags might not work and break the tests.
- Better to give inputs unique `ids` and use those to find them.
- Change login form:
```js
const LoginForm = ({ ... }) => {
    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    Username
                    <input
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    Password
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button id="login-button" type="submit">
                    Login
                </button>
            </form>
        </div>
    );
};
```
- Added `id` for the button for access later.
```js
describe("Note App", function () {
    // ...
    it("User can log in", function () {
        cy.contains("Login").click();
        cy.get("#username").type("username");
        cy.get("#password").type("password");
        cy.get("#login-button").click();

        cy.contains("EC logged in");
    });
});
```
- Last row ensures login successful.


## Some Things To Note
- Test first clicks button opening the login form.
- When form is filled, the form is submitted by clicking the submit button.
- Both buttons have the text `login`, but they are two separate buttons.
    - Only one is visible because of the `display: none` CSS style.
- If we search for button by its text, `cy.contains` will return the first of them.
    - The one opening the login form.
    - Happens even if button is not visible.
    - To avoid name conflicts, we gave the submit button the id `login-button`.
- Notice variable `cy` our tests use gives an ESlint error.
    - Rid the error by installing `eslint-plugin-cypress` as a development dependency.
```
$ npm install --save-dev eslint-plugin-cypress
```
- Change the config in `.eslintrc.js` like:
```js
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true,
        "cypress/globals": true
    },
    "extends": [
        // ...
    ],
    "parserOptions": {
        // ...
    },
    "plugins": [
        "react", "jest", "cypress"
    ],
    "rules": {
        // ...
    }
}
```


## Testing New Note Form
- Next add test which tests the "new note" functionality.
```js
describe("Note App", function () {
    // ...
    describe("When logged in", function () {
        beforeEach(function () {
            cy.contains("Login").click();
            cy.get("input:first").type("username");
            cy.get("input:last").type("password");
            cy.get("#login-button").click();
        });

        it("A new note can be created", function () {
            cy.contains("New Note").click();
            cy.get("input").type("A note created by cypress");
            cy.contains("Save").click();
            cy.contains("A note created by cypress");
        });
    });
});
```
- Only logged in users can create new notes, so we logged into the app in the `beforeEach` block.
- Test trusts that when creating a new note, the page contains only one input, so it searches for it like:
```js
cy.get("input");
```
- If page contained more inputs, the test would break.
- Better to give input an id and search for that.
- Structure of tests:
```js
describe("Note App", function () {
    // ...

    it("User can log in", function () {
        cy.contains("Login").click();
        cy.get("#username").type("username");
        cy.get("#password").type("password");
        cy.get("#login-button").click();

        cy.contains("EC logged in");
    });

    describe("When logged in", function () {
        beforeEach(function () {
            cy.contains("Login").click();
            cy.get("input:first").type("username");
            cy.get("input:last").type("password");
            cy.get("#login-button").click();
        });

        it("A new note can be created", function () {
            // ...
        });
    });
});
```
- Cypress runs tests in the order they are in the code.
- First runs `User can log in`.
- Then it runs `A new note can be created`.
    - Notice we login again.
    - Why? Wouldn't it be okay to just log in once?
    - No, each test starts from zero as far as the browser is concerned.
    - Changes to browser's state is reversed after each test.


## Controlling The State Of The Database
- If tests need to modify the server's database, it becomes more complicated.
- Ideally, server's database should be the same each time we run the tests.
    - Reliable and easily repeatable.
- Like unit and integration tests, with E2E tests, it's best to empty db and format it before the tests are run.
    - However, E2E tests have no access to the database.
- Solution is to create API endpoints to the backend for the test.
    - Can empty db using those endpoints.
    - Create new `router` for the tests.
```js
const testingRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

testingRouter.post("/reset", async (request, response) => {
    await Note.deleteMany({});
    await User.deleteMany({});
    response.status(204).end();
});

module.exports = testingRouter;
```
- Add it to the backend only if application is run on test mode:
```js
// ...

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);

if (process.env.NODE_ENV === "test") {
    const testingRouter = require("./controllers/testing");
    app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
```
- HTTP POST requests to `/api/testing/reset` endpoint empties the database.
- Make sure backend is running in test mode:
```
$ npm run start:test
```
- Change `beforeEach` block so it empties the server's db before tests are run.
- Currently not possible to add users through frontend UI.
    - So, add new user to the backend from the beforeEach block.
```js
describe("Note App", function () {
    beforeEeach(function () {
        cy.request("POST", "http://localhost:3001/api/test/reset");
        const user = {
            name: "Sample Name",
            username: "username",
            password: "password"
        };
        cy.request("POST", "http://localhost:3001/api/users/", user);
        cy.visit("http://localhost:3000");
    });

    it("Front page can be opened", function () {
        // ...
    });

    it("User can login", function () {
        // ...
    });
    
    describe("When logged in", function () {
        // ...
    });
});
```
- During formatting, the test does HTTP requests to backend with `cy.request`.
- Testing now starts with backend in the same state every time.
- Backend will contain one user and no notes.
- Add check to test for checking we can change importance of notes.
- Change frontend so that a new note is unimportant by default:
```js
const NoteForm = ({ createNote }) => {
    // ...

    const addNote = (event) => {
        event.preventDefault();
        createNote({
            content: newNote,
            important: false
        });

        setNewNote("");
    };

    // ...
};
```
- Multiple ways to test.
- Below we search for note and click its `make important` button.
- We then check that the note now contains a `make not important` button.
```js
describe("Note App", function () {
    // ...

    describe("When logged in", function () {
        // ...

        describe("And a note exists", function () {
            beforeEach(function () {
                cy.contains("New Note").click();
                cy.get("input").type("another note cypress");
                cy.contains("Save").click();
            });

            it("It can be made important", function () {
                cy.contains("another note cypress");
                  .contains("make important")
                  .click();
                
                cy.contains("another note cypress");
                  .contains("make not important");
            });
        });
    });
});
```
- We click the button and the text is now "make not important".



