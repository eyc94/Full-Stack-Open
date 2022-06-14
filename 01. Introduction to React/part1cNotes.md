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


## Stateful Component
- Components have not had any state that can change.
- Add state to our `App` component with React's `state hook`.
- Change `index.js`:
```javascript
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```
- Change `App.js`:
```javascript
import { useState } from "react";

const App = () => {
    const [ counter, setCounter ] = useState(0);

    setTimeout(
        () => setCounter(counter + 1),
        1000
    );

    return (
        <div>{counter}</div>
    );
};
```
- We see that that we add state.
    - The initial value is 0.
- The function returns an array that contains two items.
    - We assign the items to the variables `counter` and `setCounter`.
        - Done by destructuring syntax.
    - The `setCounter` is assigned to a function that modifies state.
- Use of `setTimeout` by passing two parameters.
    - THe first is a function to increment the counter state.
    - THe second is a timeout of 1 second.
- When `setCounter` is called, React re-renders the component.
    - This means the function body gets re-executed.
- This happens for as long as the application is running.
- Can debug if you want to see when it's rendering.


## Event Handling
- Increase counter when user clicks a button.
- Button elements support mouse events.
    - Most common is the `click` event.
    - Clicking can be from a keyboard or touch screen as well.
- Registering an event handler looks like this:
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    const handleClick = () => {
        console.log("clicked");
    };

    return (
        <div>
            <div>{counter}</div>
            <button onClick={handleClick}>
                plus
            </button>
        </div>
    );
};
```
- We set the `onClick` attribute of the `button` element to the `handleClick` function.
- Every time we click the button, the function is called.
- Every click will log a message to the console.
- Event handler can also be defined directly in the value assignment.
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    return (
        <div>
            <div>{counter}</div>
            <button onClick={() => console.log("clicked")}>
                plus
            </button>
        </div>
    );
};
```
- Change the event handler to this:
```javascript
<button onClick={() => setCounter(counter + 1)}>
    plus
</button>
```
- The value of `counter` gets increased by one and component is re-rendered.
- Add a button for resetting counter:
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    return (
        <div>
            <div>{counter}</div>
            <button onClick={() => setCounter(counter + 1)}>
                plus
            </button>
            <button onClick={() => setCounter(0)}>
                zero
            </button>
        </div>
    );
};
```


## Event Handler Is A Function
- So we defined the event handler in the `onClick` attribute.
- What if we tried to call the function in the `onClick` attribute.
```javascript
<button onClick={setCounter(counter + 1)}>
    plus
</button>
```
- This breaks application.
- This is because the event handler is supposed to be a `function` or a `function reference`.
- What we did is a `function call`.
- This will just cause an infinite re-render of the component and the state will keep changing.
- Define event handlers like before:
```javascript
<button onClick={() => setCounter(counter + 1)}>
    plus
</button>
```
- Function called when user clicks the button.
- Defining event handlers in JSX templates is not a good idea.
    - It's ok here because it is simple.
- Separate the event handlers into separate functions anyway:
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    const increaseByOne = () => setCounter(counter + 1);

    const setToZero = () => setCounter(0);

    return (
        <div>
            <div>{counter}</div>
            <button onClick={increaseByOne}>
                plus
            </button>
            <button onClick={setToZero}>
                zero
            </button>
        </div>
    );
};
```


## Passing State To Child Components
- Write React components that are small and reusable.
- Refactor app to have three smaller components.
    - One for displaying counter.
    - Two for buttons.
- Implement `Display` for displaying value of counter.
- Best practice is to `lift the state up` in the component hierarchy.
    - **Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.**
- Place app state in `App` component and pass it down to `Display` component with `props`.
```javascript
const Display = (props) => {
    return (
        <div>{props.counter}</div>
    );
};
```
- Only pass state of `counter` to the component:
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    const increaseByOne = () => setCounter(counter + 1);
    const setToZero = () => setCounter(0);

    return (
        <div>
            <Display counter={counter} />
            <button onClick={increaseByOne}>
                plus
            </button>
            <button onClick={setToZero}>
                zero
            </button>
        </div>
    );
};
```
- When button clicked, `App` is re-rendered, then its children are re-rendered as well.
- Make a `Button` component.
    - Pass event handler and title of button.
```javascript
const Button = (props) => {
    return (
        <button onClick={props.onClick}>
            {props.text}
        </button>
    );
};
```
- Our `App` component now is:
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    const increaseByOne = () => setCounter(counter + 1);
    const decreaseByOne = () => setCounter(counter - 1);
    const setToZero = () => setCounter(0);

    return (
        <div>
            <Display counter={counter} />
            <Button
                onClick={increaseByOne}
                text="plus"
            />
            <Button
                onClick={setToZero}
                text="zero"
            />
            <Button
                onClick={decreaseByOne}
                text="minus"
            />
        </div>
    );
};
```
- Notice that the `Button` component is reusable, so we created another button for decrementing counter.
- React tutorial recommends using `onClick` as the prop name for `onClick` attribute for buttons.


