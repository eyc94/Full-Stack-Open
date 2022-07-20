# Custom Hooks
- Exercises in this part are different than those from previous parts.
- Contains exercises which modify the Bloglist app from Parts 4 and 5.


## Hooks
- React offers 15 `built-in hooks`.
    - `https://reactjs.org/docs/hooks-reference.html`
    - Popular ones are `useState` and `useEffect`.
    - We have used the `useImperativeHandle` hook that allows components to provide their function to other components.
- React libraries have been offering hook-based APIs.
    - We used `useSelector` and `useDispatch` hooks from the `react-redux` library to share redux-store and dispatch function to our components.
- The `React Router` is also partially hook-based.
- Hooks are not normal functions.
- There are rules:
    - **Don't call Hooks inside loops, conditions, or nested functions.**
        - Always use Hooks at the top level of your React function.
    - **Don't call Hooks from regular JS functions.**
        - You can call hooks from React function components.
        - You can call hooks from custom hooks.
- There is ESlint rule that verifies correct usage of hooks.
    - CRA has a readily-configured rule `eslint-plugin-react-hooks`.


## Custom Hooks
- React allows us to creat our own `custom` hooks.
- The primary purpose of custom hooks is to allow for the reuse of the logic used in components.
    - **Building your own Hooks lets you extract component logic into reusable functions.**
- Custom hooks are regular JS functions.
    - Use any other hooks.
    - Adhere to rules of hooks.
    - The names of custom hooks start with `use`.
- From Part 1, we had a counter app that incremented, decremented, and reset value.
```js
import { useState } from "react";

const App = (props) => {
    const [counter, setCounter] = useState(0);

    return (
        <div>
            <div>{counter}</div>
            <button onClick={() => setCounter(counter + 1)}>plus</button>
            <button onClick={() => setCounter(counter - 1)}>minus</button>
            <button onClick={() => setCounter(0)}>zero</button>
        </div>
    );
};
```
- Extract counter logic into its own custom hook.
```js
const useCounter = () => {
    const [value, setValue] = useState(0);

    const increase = () => {
        setValue(value + 1);
    };

    const decrease = () => {
        setValue(value - 1);
    };

    const zero = () => {
        setValue(0);
    };

    return {
        value,
        increase,
        decrease,
        zero
    };
}
```
- Custom hook uses the `useState` hook internally to create its own state.
- Hook returns object.
    - Properties include value counter and functions for changing it.
- React components can use the hook:
```js
const App = (props) => {
    const counter = useCounter();

    return (
        <div>
            <div>{counter.value}</div>
            <button onClick={() => setCounter(counter.increase)}>plus</button>
            <button onClick={() => setCounter(counter.decrease)}>minus</button>
            <button onClick={() => setCounter(counter.zero)}>zero</button>
        </div>
    );
};
```
- Extract state of `App` and its manipulation into the `useCounter` hook.
- Managing counter state and logic is responsibility of the custom hook.
- Same hook can be reused for a left and right button.
```js
const App = () => {
    const left = useCounter();
    const right = useCounter();

    return (
        <div>
            {left.value}
            <button onClick={() => setCounter(left.increase)}>left</button>
            <button onClick={() => setCounter(right.increase)}>right</button>
            {right.value}
        </div>
    );
};
```
- Creates two separate counters.
    - First assigned to the left.
    - Second assigned to the right.
- Forms in React is tricky.
    - The following shows the user with a form that requests the user to input their name, birthday, and height:
```js
const App = () => {
    const [name, setName] = useState("");
    const [born, setBorn] = useState("");
    const [height, setHeight] = useState("");

    return (
        <div>
            <form>
                Name: <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                <br />
                Birthdate: <input type="date" value={born} onChange={(event) => setBorn(event.target.value)} />
                <br />
                Height: <input type="number" value={height} onChange={(event) => setHeight(event.target.value)} />
            </form>
            <div>
                {name} {born} {height}
            </div>
        </div>
    );
};
```
- Every field has its own state.
- Every field has an `onChange` handler for each input.
- Define our own custom `useField` hook that simplifies the state management of form:
```js
const useField = (type) => {
    const [value, setValue] = useState("");

    const onChange = (event) => {
        setValue(event.target.value);
    };

    return {
        type,
        value,
        onChange
    };
};
```
- Hook function takes type of input field as parameter.
- Function returns all attributes required by the `input`.
    - Returns `type`, `value`, and `onChange` handler.
- Used like so:
```js
const App = () => {
    const name = useField("text");
    // ...

    return (
        <div>
            <form>
                <input type={name.type} value={name.value} onChange={name.onChange} />
                // ...
            </form>
        </div>
    );
};
```


## Spread Attributes
- Simplify further.
- The `name` object has exactly all attributes that the `input` element expects as props.
    - Can pass the props using `spread syntax`:
```js
<input {...name} />
```
- The React documentation says the following two examples is the same thing:
```js
<Greeting firstName="Arto" lastName="Hellas" />

const person = {
    firstName: "Arto",
    lastName: "Hellas"
};

<Greeting {...persons} />
```
- The app gets simplified like this:
```js
const App = () => {
    const name = useField("text");
    const born = useField("date");
    const height = useField("number");

    return (
        <div>
            <form>
                Name: <input {...name} />
                <br />
                Birthdate: <input {...born} />
                <br />
                Height: {...height} />
            </form>
            <div>
                {name.value} {born.value} {height.value}
            </div>
        </div>
    );
};
```
- Forms are now greatly simplified.
- Details related to synchronizing state of form is encapsulated inside custom hook.
- Custom hooks are not only a tool for reuse, but also provide a better way for dividing our code into smaller modular parts.

