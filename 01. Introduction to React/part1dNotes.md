# A More Complex State, Debugging React Apps


## A Note On React Version
- Version 18 of React released late March 2022.
- Code in material should work.
    - Some libraries might not yet be compatible.
- If app breaks because of library compatibility, downgrade to older React.
    - Change `package.json`.
```json
{
    "dependencies": {
        "react": "^17.0.2",
        "react-dom": "^17.0.2",
        "react-scripts": "5.0.0",
        "web-vitals": "^2.1.4"
    },
    // ...
}
```
- Reinstall dependencies: `$ npm install`.
- Need to change `index.js` as well.
    - For React 17.
```javascript
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```
- For React 18.
```javascript
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDom.createRoot(document.getElementById("root")).render(<App />);
```


## Complex State
- What if app requires more complex state?
    - Can create multiple `useState` functions to create pieces of state.
- Below we create `left` and `right` state with initial value of 0.
```javascript
const App = () => {
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0);

    return (
        <div>
            {left}
            <button onClick={() => setLeft(left + 1)}>
                left
            </button>
            <button onClick={() => setRight(right + 1)}>
                right
            </button>
            {right}
        </div>
    );
};
```
- Can update pieces of state with `setLeft` and `setRight` functions.
- Can also save both states into a single object, as states can be of any type.
```javascript
{
    left: 0,
    right: 0
}
```
- In this case, application looks like:
```javascript
const App = () => {
    const [clicks, setClicks] = useState({
        left: 0, right: 0
    });

    const handleLeftClick = () => {
        const newClicks = {
            left: clicks.left + 1,
            right: clicks.right
        };
        setClicks(newClicks);
    };

    const handleRightClick = () => {
        const newClicks = {
            left: clicks.left,
            right: clicks.right + 1
        };
        setClicks(newClicks);
    };

    return (
        <div>
            {clicks.left}
            <button onClick={() => setLeft(left + 1)}>left</button>
            <button onClick={() => setRight(right + 1)}>right</button>
            {clicks.right}
        </div>
    );
};
```
- Now it's just one state.
- Event handlers change entire app state.
    - Event handlers look messy.
    - Notice the `left` and `right` properties are changed by adding 1 to the old values.
- Can use `object spread` syntax to make it more neat.
```javascript
const handleLeftClick = () => {
    const newClicks = {
        ...clicks,
        left: clicks.left + 1
    };
    setClicks(newClicks);
};

const handleRightClick = () => {
    const newClicks = {
        ...clicks,
        right: clicks.right + 1
    };
    setClicks(newClicks);
};
```
- The `...clicks` creates a new object with properties of the `clicks` object.
- Specify property after this to overwrite that specific value.
- Some might wonder why we didn't just increment the `left` or `right` property of the object.
    - NEVER mutate state directly.
    - Changing state must be done by setting the state to a new object.
    - If state is not changed, they just need to be copied over.
- Better to store state separately than in an object in this case.


## Handling Arrays
- Add state containing an array `allClicks` that holds every click that happened in app.
```javascript
const App = () => {
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0);
    const [allClicks, setAll] = useState([]);

    const handleLeftClick = () => {
        setAll(allClicks.concat("L"));
        setLeft(left + 1);
    };

    const handleRightClick = () => {
        setAll(allClicks.concat("R"));
        setRight(right + 1);
    };

    return (
        <div>
            {left}
            <button onClick={handleLeftClick}>left</button>
            <button onClick={handleRightClick}>right</button>
            {right}
            <p>{allClicks.join(" ")}</p>
        </div>
    );
};
```
- Each click stores a letter inside the `allClicks` array.
    - Letter "L" for left button.
    - Letter "R" for the right button.
- Notice we use concat to create a new copy of the old array plus the item to add.
    - Do not use the `push` array method.
- The `join` method is called to join all elements of the array separated by a space.
    - This is joined into a single string.


## Conditional Rendering
- Modify so rendering of clicking history is handled by new `History` component:
```javascript
const History = (props) => {
    if (props.allClicks.length === 0) {
        return (
            <div>
                The app is used by pressing the buttons
            </div>
        );
    }
    return (
        <div>
            Button press history: {props.allClicks.join(" ")}
        </div>
    );
};

const App = () => {
    // ...

    return (
        <div>
            {left}
            <button onClick={handleLeftClick}>left</button>
            <button onClick={handleRightClick}>right</button>
            {right}
            <History allClicks={allClicks} />
        </div>
    );
};
```
- If any button is not clicked, a message with instructions is displayed.
- Otherwise, the `allClicks` array is shown.
- Content of the render depends on the state of the component.
    - This is called `conditional rendering`.
    - Many ways to do this.
- Refactor app to use `Button` component defined earlier:
```javascript
const History = (props) => {
    if (props.allClicks.length === 0) {
        return (
            <div>
                The app is used by pressing the buttons
            </div>
        );
    }
    return (
        <div>
            Button press history: {props.allClicks.join(" ")}
        </div>
    );
};

const Button = ({ handleClick, text }) => {
    <button onClick={handleClick}>
        {text}
    </button>
};

const App = () => {
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0);
    const [allClicks, setAll] = useState([]);

    const handleLeftClick = () => {
        setAll(allClicks.concat("L"));
        setLeft(left + 1);
    };

    const handleRightClick = () => {
        setAll(allClicks.concat("R"));
        setRight(right + 1);
    };

    return (
        <div>
            {left}
            <Button handleClick={handleLeftClick} text="left" />
            <Button handleClick={handleRightClick} text="right" />
            {right}
            <History allClicks={allClicks} />
        </div>
    );
};
```


## Old React
- Before hooks, there was no way to add state to functional components.
- Components that needed state had to be defined as `class` components.
    - JavaScript class syntax.
- Still important to learn class syntax.
    - Because of legacy code.


## Debugging React Applications
- Great to understand how to debug applications.
- Keep dev console open at all times.
- Print based debugging is always a good idea.
    - Print the `props`.
    - Separate things you want printed in the same `console.log()` with a comma.
- The console also has a debugger which you can use to stop code.
    - Type `debugger` anywhere in your code.
    - Code will pause at this point.
- Recommended to add `React developer tools` to Chrome.
    - This adds `Components` tab.


## Rules of Hooks
- The `useState` and `useEffect` functions must not be called inside a loop, conditional expression, or any place that is not a function defining a component.
    - Done to make sure hooks are placed in same order.
```javascript
const App = () => {
    // These are OK.
    const [age, setAge] = useState(0);
    const [name, setName] = useState("Juha Tauriainen");

    if (age > 10) {
        // This does NOT work.
        const [foobar, setFoobar] = useState(null);
    }

    for (let i = 0; i < age; i++) {
        // This is also NOT ok.
        const [rightWay, setRightWay] = useState(false);
    }

    const notGood = () => {
        // This is NOT ok.
        const [x, setX] = useState(-1000);
    };

    return (
        // ...
    );
};
```


## Event Handling Revisited
- Develop a simple application with the following `App`:
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    return (
        <div>
            {value}
            <button>reset to zero</button>
        </div>
    );
};
```
- We want clicking of the button to reset the state of `value`.
- We need to add an event handler to the button to respond to a click event.
    - Must be a function or a reference to a function.
    - Cannot be a function call or any other thing.
- Event handler is accomplished like this:
```javascript
<button onClick={() => console.log("Clicked the button")}>
    button
</button>
```
- Event handler is a function defined with the arrow function syntax.
- When component is rendered, the event handler is just set to the function and no function is called.
    - Calling the function only happens when the button is clicked.
- Implement resetting value:
```javascript
<button onClick={() => setValue(0)}>button</button>
```
- Often the event handler definitions are defined in a separate place.
- Define a function that gets assigned to `handleClick` variable name.
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const handleClick = () => console.log("Clicked the button");

    return (
        <div>
            {value}
            <button onClick={handleClick}>reset to zero</button>
        </div>
    );
};
```
- The reference to the function is passed to the `onClick` attribute.
- If event handler function needs multiple commands, use curly braces.


## Function That Returns A Function
- Another way to define an event handler is to define a function that returns a function.
- Make the changes below:
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const hello = () => {
        const handler = () => console.log("Hello world");
        return handler;
    };

    return (
        <div>
            {value}
            <button onClick={hello()}>button</button>
        </div>
    );
};
```
- Remember earlier we stated that event handlers may not be function calls.
- Why does it work here?
    - When the component is rendered, the function gets executed and a function reference takes its spot.
- It essentially gets transformed back to the proper form.
- So what's the point?
    - Transform code:
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const hello = (who) => {
        const handler = () => {
            console.log("Hello", who);
        };
        return handler;
    };

    return (
        <div>
            {value}
            <button onClick={hello("world")}>button</button>
            <button onClick={hello("react")}>button</button>
            <button onClick={hello("function")}>button</button>
        </div>
    );
};
```
- The `hello()` function here can be thought of as a factory that makes custom handlers for greeting users.
- The function is verbose, so refactor:
```javascript
const hello = (who) => {
    return () => {
        console.log("Hello", who);
    };
};
```
- Can also omit the curly braces because there's only one statement.
```javascript
const hello = (who) =>
    () => {
        console.log("Hello", who);
    };
```
- Write all arrows on the same line:
```javascript
const hello = (who) => () => {
    console.log("Hello", who);
};
```
- Can use the same trick to define event handlers that set state of component to a given value.
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const setToValue = (newValue) => () => {
        console.log("Value now", newValue);     // Print the new value to console.
        setValue(newValue);
    };

    return (
        <div>
            {value}
            <button onClick={setToValue(1000)}>thousand</button>
            <button onClick={setToValue(0)}>reset</button>
            <button onClick={setToValue(value + 1)}>increment</button>
        </div>
    );
};
```
- When component is rendered, the `thousand` button is created.
    - The event handler is set to the return value of `setToValue(1000)`.
```javascript
() => {
    console.log("Value now", 1000);
    setValue(1000);
}
```
- However, let's just return to the normal ways.
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const setToValue = (newValue) => {
        console.log("Value now", newValue);
        setValue(newValue);
    };

    return (
        <div>
            {value}
            <button onClick={() => setToValue(1000)}>
                thousand
            </button>
            <button onClick={() => setToValue(0)}>
                reset
            </button>
            <button onClick={() => setToValue(value + 1)}>
                increment
            </button>
        </div>
    );
};
```
- Choosing between the two is a matter of taste.


## Passing Event Handlers To Child Components
- Extract button to its own component.
```javascript
const Button = (props) => {
    <button onClick={props.handleClick}>
        {props.text}
    </button>
};
```
- The component gets event handler from `handleClick` prop.
- It gets the text from the `text` prop.
- Define the event handler in the `App` component and pass this event handler into the `Button` component inside `App`.
    - Make sure the names of the functions and the attributes match.


## Do Not Define Components Within Components
- Start displaying value of app into its own `Display` component.
- Change the application by defining new component inside `App`.
```javascript
// This is the right place to define a component.
const Button = (props) => (
    <button onClick={props.handleClick}>
        {props.text}
    </button>
);

const App = () => {
    const [value, setValue] = useState(10);

    const setToValue = newValue => {
        console.log("Value now", newValue);
        setValue(newValue);
    };

    // Do not define components inside another component.
    const Display = props => <div>{props.value}</div>

    return (
        <div>
            <Display value={value} />
            <Button handleClick={() => setToValue(1000)} text="thousand" />
            <Button handleClick={() => setToValue(0)} text="reset" />
            <Button handleClick={() => setToValue(value + 1)} text="increment" />
        </div>
    );
};
```
- Do not define components in components.
- React treats a component defined in another component as a new component in every render.
    - Impossible to optimize.
- Move `Display` outside.


