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


## Failed Login Test
- Make test to ensure login attempt fails if the password is wrong.
- Cypress runs all tests by default.
    - Time consuming when there becomes a lot of tests.
- When making new test or when debugging broken test, we can define the test with `it.only` instead of `it`.
    - Cypress will only run the required test.
- When the test is working, we can remove `.only`.
- First version of our test:
```js
describe("Note App", function () {
    // ...

    it.only("Login fails with wrong password", function () {
        cy.contains("Login").click();
        cy.get("#username").type("username");
        cy.get("#password").type("wrong");
        cy.get("#login-button").click();

        cy.contains("Wrong credentials");
    });

    // ...
});
```
- The test checks for the error message printed.
- The application renders the error message to a component with CSS class `error`:
```js
const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className="error">
            {message}
        </div>
    );
};
```
- We can make sure that the error message gets rendered to the correct component:
```js
it("Login fails with wrong password", function () {
    // ...

    cy.get(".error").contains("Wrong credentials");
});
```
- We use `cy.get` to get component with CSS class `error`.
- We then check that the error message can be found from this component.
- Can use the `should` syntax:
```js
it("Login fails with wrong password", function () {
    // ...

    cy.get(".error").should("contain", "Wrong credentials");
});
```
- Using `should` is trickier.
    - Allows for more diverse tests than `contains` which works based on text content only.
- Can make sure that the error message is red and it has a border:
```js
it("Login fails with wrong password", function () {
    // ...

    cy.get(".error").should("contain", "Wrong credentials");
    cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    cy.get(".error").should("have.css", "border-style", "solid");
});
```
- Cypress requires colors be given as `rgb`.
- Because all tests are for the same component we accessed using `cy.get`, we can chain them using `and`.
```js
it("Login fails with wrong password", function () {
    // ...

    cy.get(".error")
      .should("contain", "Wrong credentials");
      .and("have.css", "color", "rgb(255, 0, 0)");
      .and("have.css", "border-style", "solid");
});
```
- Finish test so that it also checks the app does not render the success message.
```js
it("Login fails with wrong password", function () {
    cy.contains("Login").click();
    cy.get("#username").type("username");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();

    cy.get(".error")
      .should("contain", "Wrong credentials");
      .and("have.css", "color", "rgb(255, 0, 0)");
      .and("have.css", "border-style", "solid");

    cy.get("html").should("not.contain", "EC logged in");
});
```
- The `should` should always be chained with `get` (or another chainable command).
- Used `cy.get("html")` to access whole visible content of the app.
- Some CSS properties behave differently on Firefox.
- If you run tests with Firefox:
    - Tests that involve `border-style`, `border-radius`, and `padding`.
    - Passes in Chrome and Electron but not in Firefox.


## Bypassing The UI
- Currently our tests:
```js
describe("Note App", function () {
    it("User can log in", function () {
        cy.contains("Login").click();
        cy.get("#username").type("username");
        cy.get("#password").type("password");
        cy.get("#login-button").click();

        cy.contains("EC logged in");
    });

    it.only("Login fails with wrong password", function () {
        // ...
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
- First we test logging in.
- Then, we expect the user to be logged in.
- User is logged in in the `beforeEach` block.
- Each test starts from zero!
    - Tests do not start from the state where the previous tests ended.
- Cypress documentation says:
    - Fully test the login flow - but only once!
    - Instead of logging in a user using the form in the `beforeEach` block, Cypress recommends we bypass the UI and do an HTTP request to the backend to log in.
    - Logging in with HTTP request is faster than filling out a form.
- A little complicated.
- When user logs in, our app saves their details to localStorage.
    - Cypress can handle this as well.
```js
describe("When logged in", function () {
    beforeEach(function () {
        cy.request("POST", "http://localhost:3001/api/login", {
            username: "username", password: "password"
        }).then(response => {
            localStorage.setItem("loggedNoteappUser", JSON.stringify(response.body));
            cy.visit("http://localhost:3000");
        });
    });

    it("A new note can be created", function () {
        // ...
    });

    // ...
});
```
- Can access response to a `cy.request` with `then` method.
- The `cy.request`, like all Cypress commands, are `promises`.
- The callback saves user details to local storage and reloads the page.
- No difference to a user logging in with the login form.
- If and when we write tests to our app, we have to use login code multiple times.
    - Make it a custom command.
- Custom commands are declared in `cypress/support/commands.js`.
- Code for logging in:
```js
Cypress.Commands.add("login", ({ username, password }) => {
    cy.request("POST", "http://localhost:3001/api/login", {
        username: "username", password: "password"
    }).then(response => {
        localStorage.setItem("loggedNoteappUser", JSON.stringify(response.body));
        cy.visit("http://localhost:3000");
    });
})
```
- Using custom command is easy and our test becomes cleaner:
```js
describe("When logged in", function () {
    beforeEach(function () {
        cy.login({ username: "username", password: "password" });
    });

    it("A new note can be created", function () {
        // ...
    });

    // ...
});
```
- Sample applies to creating a new note.
- We have a test which makes a new note using the form.
- We make a new note in the `beforeEach` block of test testing changing the importance of a note:
```js
describe("Note app", function () {
    // ...

    describe("When logged in", function () {
        it("A new note can be created", function () {
            cy.contains("New Note").click();
            cy.get("input").type("A note created by cypress");
            cy.contains("Save").click();

            cy.contains("A note created by cypress");
        });

        describe("And a note exists", function () {
            beforeEach(function () {
                cy.contains("New note").click();
                cy.get("input").type("Another note cypress");
                cy.contains("Save").click();
            });

            it("It can be made important", function () {
                // ...
            });
        });
    });
});
```
- Make a new custom command for making a new note.
- Command will make a new note with an HTTP POST request.
```js
Cypress.Commands.add("createNote", ({ content: important }) => {
    cy.request({
        url: "http://localhost:3001/api/notes",
        method: "POST",
        body: { content, important },
        headers: {
            "Authorization": `bearer ${JSON.parse(localStorage.getItem("loggedNoteappUser")).token}`
        }
    });

    cy.visit("http://localhost:3000");
});
```
- Command expects user to be logged in.
- User details saved to localStorage.
- Now formatting block becomes:
```js
describe("Note app", function () {
    // ...

    describe("When logged in", function () {
        it("A new note can be created", function () {
            // ...
        });

        describe("And a note exists", function () {
            beforeEach(function () {
                cy.createNote({
                    content: "another note cypress",
                    important: false
                });
            });

            it("It can be made important", function () {
                // ...
            });
        });
    });
});
```


## Changing The Importance Of A Note
- Let's look at the test we did for changing importance of note.
- Change formatting block so that it creates three notes instead of one.
```js
describe("When logged in", function () {
    describe("And several notes exist", function () {
        beforeEach(function () {
            cy.createNote({ content: "first note", important: false });
            cy.createNote({ content: "second note", important: false });
            cy.createNote({ content: "third note", important: false });
        });

        it("One of those can be made important", function () {
            cy.contains("second note")
              .contains("make important")
              .click();

            cy.contains("second note")
              .contains("make not important");
        });
    });
});
```
- How does `cy.contains` actually work?
- When clicking `cy.contains("second note")` command in Cypress `Test Runner`, we see that the command searches for the element containing the text `second note`.
- Clicking next line `.contains("make important")`, we see that test uses the "make important" button corresponding to `second note`.
- When chained, the second `contains` command continues search within the same component found by the first command.
- If we did not chain:
```js
cy.contains("second note");
cy.contains("make important").click();
```
- Behavior is different.
- Second line of test would click button of the wrong note.
- When coding tests, check test runner to ensure tests are using the right components!
- Change `Note` component so that the text of the note is rendered to a `span`.
```js
const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? "make not important" : "make important";

    return (
        <li className="note">
            <span>{note.content}</span>
            <button onClick={toggleImportance}>{label}</button>
        </li>
    );
};
```
- Test breaks!
- The `cy.contains("second note")` now returns the component containing text.
    - The button is not in it.
- One way to fix this:
```js
it("One of those can be made important", function () {
    cy.contains("second note").parent().find("button").click();
    cy.contains("second note").parent().find("button")
      .should("contain", "make not important");
});
```
- In the first line, we use `parent` command to access parent element of element containing `second note` and find the button from within it.
- We click the button.
- Check the text on it changes.
- We use the `find` command to search for the button.
    - We cannot use `cy.get` because it always searches the whole page and would return all 5 buttons on the page.
- Unfortunately we have copy-pasted tests.
- Code for searching button is always the same.
- In these situations, it is possible to use the `as` command.
```js
it("One of those can be made important", function () {
    cy.contains("second note").parent().find("button").as("theButton");
    cy.get("@theButton").click();
    cy.get("@theButton").should("contain", "make not important");
});
```
- First line finds the right button.
    - Uses `as` to save it as `theButton`.
- Following lines can use the named element with `cy.get("@theButton")`.


## Running and Debugging The Tests
- Some notes on how Cypress works and debugging your tests.
- There is the impression that the tests are normal JS code.
- We can try this:
```js
const button = cy.contains("Login");
button.click();
debugger();
cy.contains("Logout").click();
```
- Won't work.
- When Cypress runs a test, it adds each `cy` command to an execution queue.
- Cypress executes each command in queue one by one.
- Cypress commands always return `undefined`.
    - So, `button.click()` would cause an error.
- An attempt to start debugger does not stop the code between commands but before any commands have been run.
- Cypress commands are like `promises`.
    - Accessing return values means using the `then` method.
    - The following test prints number of buttons in app and click the first button:
```js
it("Then example", function () {
    cy.get("button").then(buttons => {
        console.log("Number of buttons", buttons.length);
        cy.wrap(buttons[0]).click();
    });
});
```
- Stopping test execution with debugger is possible.
- Debugger starts only if Cypress test runner is open.
- We have run Cypress tests with our graphical test runner.
    - Also possible to run from command line.
    - Add an npm script:
```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 db.json",
    "cypress:open": "cypress open",
    "test:e2e": "cypress run"
},
```
- Now we can run tests from command line with: `$ npm run test:e2e`.
- Videos of test execution will be saved to `cypress/videos/`.
    - You should add this folder to `.gitignore`.


