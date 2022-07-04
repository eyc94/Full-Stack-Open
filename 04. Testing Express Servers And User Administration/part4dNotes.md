# Token Authentication
- Users must be able to log into our app.
- When user is logged in.
    - User info should attach automatically to any new note they create.
- Implement support for `token based authentication` to the backend.
- We describe the principles of token based authentication in the following:
    - The user starts by logging in using a login form implemented with React.
        - We add login form to frontend in Part 5.
    - React code sends username and password to the server address `/api/login` as a HTTP POST request.
    - If username and password match, the server generates a `token` which identifies the logged in user.
        - Token is digitally signed.
        - Impossible to falsify.
    - Backend responds with a status code indicating successful operation.
        - Returns the token with the response.
    - Browser saves the token.
        - For example, to the state of React app.
    - User creates a new note (or does operation requiring identification).
        - React code sends token to the server with request.
    - Server uses token to identify the user.
- Implement functionality for logging in.
- Install `jsonwebtoken` library: `https://github.com/auth0/node-jsonwebtoken`.
    - Allows us to generate `JSON web tokens`.
        - `https://jwt.io/`
```
$ npm install jsonwebtoken
```
- Code for login functionality goes to `controllers/login.js`.
```js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: "invalid username or password"
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response
        .status(200)
        .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
```
- Code starts by searching for the user from db by the `username` attached to the request.
    - Next, checks the `password` attached to request.
    - Passwords not saved to db. The hashes calculated from the password is.
    - The `bcrypt.compare` method is used to check if password is correct.
- Return `401 Unauthorized` if the user is not found or password is incorrect.
    - Reason for failure is in response body.
- Correct password means that a token is created with the method `jwt.sign`.
    - Token contains username and user id in a digitally signed form.
- Token signed with string from env var `SECRET` as the `secret`.
    - Ensures that only parties that know the secret can generate a valid token.
    - Value for env var must be set in the `.env` file.
- Sucessful request is responded to with status code `200 OK`.
    - Generated token and username of the user is sent back in response body.
- Code for login has to be added to app by adding new router to `app.js`:
```js
const loginRouter = require("./controllers/login");

// ...

app.use("/api/login", loginRouter);
```
- Try logging in using VS Code REST Client:
```
post http://localhost:3001/api/login
Content-Type: application/json

{
    "username": "mluukkai",
    "password": "salainen"
}
```
- Does not work.
- Forgot to set value to variable `SECRET`.
    - Can be any string.
    - Set value in `.env` and it works.
- Successful login returns the user details and the token
- Wrong username and password returns an error message and proper status code.


## Limiting Creating New Notes To Logged In Users
- Change creating new notes so it is only possible if post request has a valid token attached.
- Note is then saved to the notes list of the user identified by the token.
- Several ways to send token from browser to server.
    - We use the `Authorization` header.
    - Header tells which `authentication scheme` is used.
    - This is necessary if server offers multiple ways to authenticate.
    - Identifying scheme tells the server how the attached credentials should be interpreted.
- The `Bearer` scheme is suitable to our needs.
    - This means if the token is `eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW`.
    - Authorization header will have value: `Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW`
- Creating a new note will change like so:
```js
const jwt = require("jsonwebtoken");

// ...

const getTokenFrom = request => {
    const authorization = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        return authorization.substring(7);
    }
    return null;
};

notesRouter.post("/", async (request, response) => {
    const body = request.body;
    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);

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
- The `getTokenFrom` function isolates the token from the `authorization` header.
- Validity of token checked with `jwt.verify`.
- Method also decodes the token.
    - Or returns the Object the token was based on.
- If no token is passed, it will return "jwt must be provided".
- The object decoded from token contains `username` and `id` fields.
    - Tells server who made the request.
- If the decoded object from token does not have the user's identity (`decodedToken.id` is undefined).
    - The error status code `401 unauthorized` is returned.
    - The reason for the failure is explained in the response body.
- When identity of maker of request is resolved, execution continues.
- New note can now be created using Postman.
    - The `authorization` header must be given the correct value.
    - The string `bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW`.
        - The second value is the token returned by the `login` operation.


## Error Handling
- Token verification can cause `JsonWebTokenError`.
- If we remove a few characters from the token and try to create a note, we get that error.
- Many reasons for decoding error.
    - Token can be faulty like above.
    - Or it can be falsified or expired.
    - Extend the `errorHandler` middleware to take into account the different decoding errors.
```js
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown edpoint" });
};

const errorHandler = (error, request, response, next) => {
    if (error.name === "CastError") {
        return response.status(400).send({
            error: "Malformatted ID"
        });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({
            error: error.message
        });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({
            error: "Invalid token"
        });
    }

    logger.error(error.message);
    next(error);
};
```
- If app has multiple interfaces requiring identification.
    - JWT's validation should be in its own middleware.
    - Existing library like `express-jwt` could also be used.


## Problems of Token-based Authentication
- Token authentication is easy to implement.
- Contains one problem.
- Once the API user like a React app gets a token.
    - API has a blind trust to the token holder.
    - What if access rights of the token holder should be revoked?
- Two solutions.
    - Easier is to limit the validity period of a token:
```js
loginRouter.post("/", async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: "invalid username or password"
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id
    };

    // Token expires in 60*60 seconds, this is, in one hour.
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 }
    );

    response
        .status(200)
        .send({ token, username: user.username, name: user.name });
});
```
- Once token expires, client app needs to get a new token.
- Happens by forcing user to relogin to the app.
- Error handling should be extended to give a proper error in case of expired token.
```js
const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({
            error: "Malformatted ID"
        });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({
            error: error.message
        });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({
            error: "Invalid token"
        });
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json({
            error: "Token expired"
        });
    }
    
    next(error);
};
```
- The shorter the time, the more safe the solution is.
    - Token only used for a limited time.
    - However, this means the user has to frequently login.
- Other solution:
    - Save info about each token to backend db and to check for each API request if the access right corresponding to the token is still valid.
    - The access rights can be revoked at any time.
    - This is called `server side session`.
    - This server side session increases complexity of the backend.
    - Also affects performance because token validity needs to be checked with each API request to db.
    - A db access is slower compared to checking validity from the token itself.
    - Common to save session corresponding to a token to a `key-value-database` such as `Redis`.
- When server side sessions are used, the token is often just a random string.
    - Does not have info about user as it is quite often the case when jwt-tokens are used.
    - For each API request the server fetches the relevant info about the identity of the user from the db.
    - Also usual that instead of using Authorization-header, `cookies` are used as the mechanism for transferring the token between the client and the server.


## End Notes
- Many changes now, so tests are probably broken.
    - Leaving the fixing of tests as a non compulsory exercise.
- Usernames, passwords, and applications using token authentication must always be used over `HTTPS`.
    - Can use Node `HTTPS` server in our app instead of `HTTP` server.
        - Requires more configuration.
    - The prod version of our app is in Heroku, so our app stays secure.
    - Heroku routes all traffic between a browser and the Heroku server over HTTPS.


