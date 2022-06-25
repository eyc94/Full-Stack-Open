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




