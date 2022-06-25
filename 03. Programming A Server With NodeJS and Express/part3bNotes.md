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


## Frontend Production Build
- We have been running React code in `development mode`.
    - We can see errors and recompile off the bat.
- When application is deployed, we must create a `production build` or a version of the app which is optimized for production.
- Production build of apps created with `create-react-app` can be created with `npm run build`.
- On (20th January 2022), CRA had a bug that causes the error:
    - `TypeError: MiniCssExtractPlugin is not a constructor`.
    - A fix can be found here: `https://github.com/facebook/create-react-app/issues/11930`.
    - Add the following to `package.json`.
```json
{
    // ...
    "resolutions": {
        "mini-css-extract-plugin": "2.4.5"
    }
}
```
- Run the following commands:
```
$ rm -rf package-lock.json
$ rm -rf node_modules
$ npm cache clean --force
$ npm install
```
- `npm run build` should now work.
    - Run this command from the root of the frontend project.
- This creates a folder called `build`.
    - Contains the only HTML file of our app, `index.html`.
    - Contains the directory `static`.
    - Minified version of our app's JS code will be generated to the `static` folder.
    - App code may be in muliple files, but all JS code will be minified into one file.
- Not very readable.


## Serving Static Files From The Backend
- One option to deploying the frontend is to copy the production build (`build` folder) to the root of the backend repo.
- Configure backend to show the frontend's `main page` (the file `build/index.html`) as its main page.
- Begin by copying production build of frontend to the root of the backend.
- With Mac or Linux, copy with:
```
$ cp -r build <path_to_backend_repo>
```
- To make express show `static` content, the page `index.html` and JS that it fetches, we need a built-in middleware from express called `static`.
- Use `app.use(express.static("build"))`.
- When exepress gets an HTTP GET request, it first checks if the `build` folder has a file corresponding to the request's address.
    - If the file is found, express will return it.
- Now, HTTP GET requests to `www.serversaddress.com/index.html` or `www.serveraddress.com` will show the React frontend.
    - GET requests to `www.serversaddress.com/api/notes` will be handled by the backend's code.
- Our frontend and backend are at the same address.
    - Declare `baseUrl` as a `relative` URL.
    - Leave out the part declaring the server.
```javascript
import axios from "axios";
const baseUrl = "/api/notes";

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

// ...
```
- After the change, create a new production build.
    - Copy it to the backend root repo.
    - The application can now be used from the `backend` address `http://localhost:3001`.
- Our app is now working like the `single-page app` from Part 0.
- When we go to `http://localhost:3001`, the server returns the `index.html` file from the `build` repository.
    - Summarized contents of the `index.html` file below:
```html
<html>
<head>
    <meta charset="utf-8">
    <title>React App</title>
    <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet">
</head>
<body>
    <div id="root"></div>
    <script src="/static/js/1.578f4ea1.chunk.js"></script>
    <script src="/static/js/main.104ca08d.chunk.js"></script>
</body>
</html>
```
- We notice that there is a CSS that gets the styles of the app and the script the fetches JS.
- React code fetches notes from the server `http://localhost:3001/api/notes` and renders them to the screen.
    - Communication between server and browser can be seen in the `Network` tab.
- Now our setup that is ready for product deployment looks like this:
    - Unlike running app is development environment, everything is now in the same node/express-backend that runs in localhost:3001.
    - When browser goes to the page, `index.html` is rendered.
    - This causes the browser to fetch the product version of React app.
    - Once it runs, it fetches the json-data from `localhost:3001/api/notes`.


## The Whole App To The Internet
- Verify that the production version of the application works locally.
- Commit the production build to the backend repo.
- Push the code to Heroku again.
- Application works great, but the importance changing is not working still.
- App saves notes to a variable.
    - If the app crashes or restarts, the data will disappear.
    - The app needs a database.
- Let's see our app setup now:
    - The node/express-backend resides in Heroku server.
    - When the root address is of the form `https://<name_of_app>.herokuapp.com/` is accessed, the browser loads and executes the React app that fetches the json-data from Heroku server.


## Streamlining Deploying Of The Frontend
- Add npm scripts to reduce manual work of creating new production build.
- Add to `package.json` of backend repo:
```json
{
    "scripts": {
        // ...
        "build:ui": "rm -rf build && cd <path_to_frontend> && npm run build && cp -r build <path_to_backend>",
        "deploy": "git push heroku main",
        "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",
        "logs:prod": "heroku logs --tail"
    }
}
```
- The `build:ui` script removes build from backend repo, goes to frontend repo and copies the build from frontend to backend repo.
- The `deploy` script releases the current backend to Heroku.
- The `npm run deploy:full` combines the two above and contains the `git` commands to update backend repo.
- Finally, `npm run logs:prod` shows Heroku logs.


## Proxy
- Changes on frontend caused it to no longer work in dev mode.
    - `npm start`.
- Connection to backend does not work.
- This is because the backend address is relative now.
```javascript
const baseUrl = "/api/notes";
```
- In dev mode, the frontend is `localhost:3000`, the requests to backend go to `localhost:3000/api/notes`.
    - The backend we know is at `localhost:3001`.
- If project created using `create-react-app`, this is easy.
    - Add the following to `package.json` of the frontend repo:
```json
{
    "dependencies": {
        // ...
    },
    "scripts": {
        // ...
    },
    "proxy": "http://localhost:3001"
}
```
- After restart, React dev environment will work as a `proxy`.
- If React code does an HTTP request to a server address at `http://localhost:3000` not managed by React app itself (when requests are not about fetching CSS or JS of app), the request will be redirected to the server at `http://localhost:3001`.
- Now frontend works with backend in prod and dev.
- Notice how complicated it is to deploy frontend.
    - You have to keep making a production build and copy it to the backend.
    - Creating an automated deployment pipeline is now harder.
        - Deployment pipeline means an automated way and controlled way to move code from the computer of the developers through different tests and quality checks to production.
        - Discussed in Part 11.
    - Multiple ways to achieve this like placing frontend and backend in the same repo.
    - Can also deploy frontend as its own app.
    - Apps created with `create-react-app`, it's straightforward.

