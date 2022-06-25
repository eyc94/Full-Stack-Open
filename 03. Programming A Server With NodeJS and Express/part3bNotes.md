# Deploying App To Internet
- Connect frontend we made in Part 2 with backend we made in Part 3A.
- Previously, frontend asks for list of notes from `json-server` backend.
    - From address: `http://localhost:3001/notes`
- Backend now has different structure.
    - From address: `http://localhost:3001/api/notes`.
- Change `baseUrl` in `src/services/notes.js` file.
```javascript
import axios from "axios";
const baseUrl = "http://localhost:3001/api/notes";

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

// ...

export default { getAll, create, update };
```
- Also need to change URL specified in the effect in `App.js`:
```javascript
useEffect(() => {
    axios
        .get("http://localhost:3001/api/notes")
        .then(res => {
            setNotes(res.data);
        });
}, []);
```
- The frontend's GET request to `http://localhost:3001/api/notes` does not work for some reason.
- What's happening?
    - We can access backend from browser and Postman without problems.


## Same Origin Policy and CORS
- The issue is with something called `CORS` or `Cross-Origin Resource Sharing`.
- In `Wikipedia`:
    - **Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be request from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.**
- For our use, our application runs in a different domain than the server.
    - The domain for our app is localhost port 3000 while the server is localhost port 3001.
    - JS code of an app that runs in a browser can only communicate with a server in the same `origin`.
- Can allow requests from other `origins` using Node's `cors` middleware.
- Install `cors` in the backend.
```
npm install cors
```
- Use the middleware and allow requests from all origins.
```javascript
const cors = require("cors");
app.use(cors());
```
- The frontend works!
- However, functionality for changing importance does not work because it's not implemented yet in the backend.
- The setup of our app is now:
    - The react app running in the browser now fetches the data from node/express server that runs in localhost:3001.


## Application To The Internet
- Move our application to the internet!
- Use `Heroku`.
    - Documentation: `https://devcenter.heroku.com/articles/getting-started-with-nodejs`.
- Add `Procfile` to the backend repo root.
    - This is to tell how to start the application.
```
web: npm start
```
- Change the definition of the port our application uses at the bottom of the `index.js` file.
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```
- We use the port defined in the `environment variable` or port 3001 if `PORT` is undefined.
    - Heroku configures the port based on environment variable.
- Create `.gitignore` and add `node_modules`.
- Create a Heroku account at `https://devcenter.heroku.com`.
    - Install Heroku package using `npm install -g heroku`.
    - Create Heroku app with `heroku create`.
    - Commit your code to the repo.
    - Move it to Heroku with `git push heroku main`.
- If everything went well, you should be able to access application at:
    - `https://<name_of_app>.herokuapp.com/api/notes`
- If there is an issue, look at heroku logs with `heroku logs` command.
- Should begin by developing while keeping an eye on heroku logs.
    - Use command `heroku logs -t`.
    - Prints logs whenever something happens on the server.
- If deploying from a git repo where your code is not on the main branch.
    - (i.e. If you are altering the `notes repo` from last lesson).
    - Run `git push heroku HEAD:master`.
- If you have already done a push to Heroku, might need to run:
    - `git push heroku HEAD:main --force`
- Frontend should also work with backend on Heroku.
    - Change the backend's address on frontend to be the backend's address in Heroku instead of `http://localhost:3001`.
- So, how do we deploy frontend to the internet?
    - We have multiple options.
    - Option 1 below.




