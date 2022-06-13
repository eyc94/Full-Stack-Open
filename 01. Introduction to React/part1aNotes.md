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


## Component
- The `App.js` is a `React component` with the name `App`.
- The last line of `index.js` basically renders the contents of `App` into the `div` element with the id of `root` in the file `public/index.html`.
- The `index.html` file does not have any HTML visible to us in the browser.
    - All content that needs to be rendered is defined as React components.
- Take a look at code defining component:
```javascript
const App = () => (
    <div>
        <p>Hello world</p>
    </div>
);
```
- Component rendered as a `div` element.
    - This wraps a `p` element that contains text.
- Component is defined as a JavaScript function.
- Following is a function that does not receive any parameters:
```javascript
() => (
    <div>
        <p>Hello world</p>
    </div>
)
```
- The function is then assigned to a constant variable `App`.
```javascript
const App = ...
```
- Few ways to define functions.
- We use `arrow functions` defined in ECMAScript 6 or ES6.
- Our function consists of only a single expression, so we use the shorthand below:
```javascript
const App = () => (
    <div>
        <p>Hello world</p>
    </div>
);
```
- Can also render dynamic content inside components:
```javascript
const App = () => {
    const now = new Date();
    const a = 10;
    const b = 20;

    return (
        <div>
            <p>Hello world, it is {now.toString()}</p>
            <p>
                {a} plus {b} is {a + b}
            </p>
        </div>
    );
};
```
- Any JavaScript code in curly braces is evaluated and placed in the HTML at that location.


## JSX
- Layout of React components is written using `JSX`.
- We are dealing with a way to write JavaScript.
- JSX returned by React components is compiled into JavaScript.
- After compiling, our application looks like this:
```javascript
const App = () => {
    const now = new Date();
    const a = 10;
    const b = 20;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "p", null, "Hello world, it is ", now.toString()
        ),
        React.createElement(
            "p", null, a, " plus ", b, " is ", a + b
        )
    );
};
```
- Compiling is handled by `Babel`.
    - Projects created with `create-react-app` are configured to compile automatically.
- JSX is similar to many templating languages.
- Every tag needs to be closed.
    - A new line is an empty element which is written in HTML like `<br>`.
    - When writing JSX, the tag needs to be closed like `<br />`.


## Multiple Components
- Modify `App.js`:
    - The export statement is left out for more space, but pretend it is there.
```javascript
const Hello = () => {
    return (
        <div>
            <p>Hello world</p>
        </div>
    );
};

const App = () => {
    return (
        <div>
            <h1>Greetings</h1>
            <Hello />
        </div>
    );
};
```
- Defined a component `Hello` and used it inside `App`.
- We can use it multiple times.
```javascript
const App = () => {
    return (
        <div>
            <h1>Greetings</h1>
            <Hello />
            <Hello />
            <Hello />
        </div>
    );
};
```
- Reusing components is a core idea of React.
- Having a `root` component called `App` is also a core idea of React.


## props: Passing Data To Components
- Can pass data to components using `props`.
- Modify `Hello` as follows:
```javascript
const Hello = (props) => {
    return (
        <div>
            <p>Hello {props.name}</p>
        </div>
    );
};
```
- We see the function defining component has a parameter `props`.
    - Parameter receives an object.
    - This object has fields corresponding to all the "props" the user of the component defines.
- The `props` are defined like so:
```javascript
const App = () => {
    return (
        <div>
            <h1>Greetings</h1>
            <Hello name="George" />
            <Hello name="Daisy" />
        </div>
    );
};
```
- There can be as many props.
    - Their values can be hard-coded strings or results of JS expressions.
        - JS expressions must be written in curly braces.
- Modify `Hello` component to use two props:
```javascript
const Hello = (props) => {
    return (
        <div>
            <p>
                Hello {props.name}, you are {props.age} years old
            </p>
        </div>
    );
};

const App = () => {
    const name = "Peter";
    const age = 10;

    return (
        <div>
            <h1>Greetings</h1>
            <Hello name="Maya" age={26 + 10} />
            <Hello name={name} age={age} />
        </div>
    );
};
```
- The props sent by the `App` component are the values of the variables, result of expression, and hard-coded string.


