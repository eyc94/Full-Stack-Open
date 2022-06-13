# Component State, Event Handlers

- Go back to React.
- Start with a new example.
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


## Component Helper Functions
- Expand the `Hello` component so it guesses year of birth of person greeted:
```javascript
const Hello = (props) => {
    const bornYear = () => {
        const yearNow = new Date().getFullYear();
        return yearNow - props.age;
    };

    return (
        <div>
            <p>
                Hello {props.name}, you are {props.age} years old
            </p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    );
};
```
- Notice the logic is in a separate component.
- Notice also that the helper function is defined inside a component function.
    - This is common in JavaScript.


## Destructuring
- Can `destructure` values from objects and arrays.
- We had to reference data as `props.name` and `props.age`.
- We repeated `props.age` twice in our code.
    - We know `props` is an object.
```javascript
props = {
    name: "Arto Hellas",
    age: 35
};
```
- Streamline our component by assigning values of properties directly into two variables `name` and `age`.
```javascript
const Hello = (props) => {
    const name = props.name;
    const age = props.age;

    const bornYear = () => new Date().getFullYear() - age;

    return (
        <div>
            <p>Hello {name}, you are {age} years old</p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    );
};
```
- Used compact arrow syntax for function.
- The two below are the same:
```javascript
const bornYear = () => new Date.getFullYear() - age;

const bornYear = () => {
    return new Date().getFullYear() - age;
};
```
- Destructuring is more useful.
```javascript
const Hello = (props) => {
    const { name, age } = props;
    const bornYear = () => new Date().getFullYear() - age;

    return (
        <div>
            <p>Hello {name}, you are {age} years old</p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    );
};
```
- Take it a step further.
```javascript
const Hello = ({ name, age }) => {
    const bornYear = () => new Date().getFullYear() - age;

    return (
        <div>
            <p>Hello {name}, you are {age} years old</p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    );
};
```
- We don't need to assign the values anymore to variables.


## Page Re-rendering
- Appearance remains same after initial rendering of a page.
- What if we wanted a counter where value increases as a function of time or a click of a button?
- Start with `App.js`:
```javascript
const App = (props) => {
    const {counter} = props;
    return (
        <div>{counter}</div>
    );
};

export default App;
```
- Then `index.js`:
```javascript
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

let counter = 1;

ReactDOM.createRoot(document.getElementById("root")).render(
    <App counter={counter} />
);
```
- Notice the `App` component is given the value of the counter.
- Even if we tried to update the value of `counter`, it won't re-render.
    - Need to call `render` function again.
```javascript
let counter = 1;

const refresh = () => {
    ReactDOM.createRoot(document.getElementById("root")).render(
        <App counter={counter} />
    );
};

refresh();
counter += 1;
refresh();
counter += 1;
refresh();
```
- Should use `setInterval` to be able to see the numbers being rendered.
```javascript
setInterval(() => {
    refresh();
    counter += 1;
}, 1000);
```
- Not recommended to call `refresh` multiple times like this.
- There's a better way.


