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




