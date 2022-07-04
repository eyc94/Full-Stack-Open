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


