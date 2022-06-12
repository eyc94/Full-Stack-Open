# Introduction to React

- Start understanding the `React` library.
- Easiest way to get started is using a tool called `create-react-app (CRA)`.
- Create application called `part` and go to its directory.
```
$ npx create-react-app part1
$ cd part1
```
- Run the application:
```
$ npm start
```
- App runs in localhost port 3000 by default.
    - `http://localhost:3000`.
- Open the directory in an editor as well.
- All code resides in the `src` folder.
- Simplify code for `index.js`:
```javascript
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```
- Simplify `App.js`:
```javascript
const App = () => {
    <div>
        <p>Hello world</p>
    </div>
};

export default App;
```
- Files `App.css`, `App.test.js`, `index.css`, `logo.svg`, `setupTests.js`, and `reportWebVitals.js` can be deleted.
    - Not needed right now.
- If you get the error:
    - `Module note found: Error: Can't resolve "react-dom/client"`
    - You are using a React version older than the current version 18.
    - Fix `index.js`:
```javascript
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```


