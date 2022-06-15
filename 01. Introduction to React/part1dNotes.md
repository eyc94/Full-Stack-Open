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


