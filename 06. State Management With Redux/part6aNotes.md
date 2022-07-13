# Flux-Architecture and Redux
- So far, we did what's recommended.
- We placed all state in the app's root component.
- We then passed state and all handlers down to the components using props.
- Works up to a point and the app just gets larger.
- State management gets more complex.


## Flux-Architecture
- Facebook developed the `Flux` architecture.
    - `https://facebook.github.io/flux/docs/in-depth-overview/`
    - Makes state management easier.
- State separated completely from React components in its own `stores`.
    - State in store is not changed directly.
    - Changed with different `actions`.
- When actions change the state of the store, the `views` are rerendered.
- If an action (like pressing button), changes state, the change is made with an action.
    - Causes rerendering the view.
- Flux offers a way for how and where the app's state is kept and how it is modified.


## Redux
- We will use the `Redux` library.
    - Sample principle as Flux but simpler.
- We will implement a counter application again.
- Create a new `create-react-app` and install redux:
```
$ npm install redux
```
- In Redux the state is stored in a `store`.
- State of app is stored into one JavaScript object in the store.
    - App only needs value of the counter so store straight in the store.
    - If state is more complicated, different things in the state would be saved as separate fields of the object.
- State of store is changed with `actions`.
    - Actions are objects.
    - Have at least one field determining the `type` of action.
    - App needs for example the following action:
```js
{
    type: "INCREMENT"
}
```
- Other fields can be declared as needed.
- Our app is simple so actions are fine with just the type field.
- Impact of action to the state of the app is defined using a `reducer`.
    - Reducer is a function which is given the current state and an action as parameters.
    - Returns a new state.
- Define a reducer for our app:
```js
const counterReducer = (state, action) => {
    if (action.type === "INCREMENT") {
        return state + 1;
    } else if (action.type === "DECREMENT") {
        return state - 1;
    } else if (action.type === "ZERO") {
        return 0;
    }

    return state;
};
```
- First parameter is `state` in store.
- Reducer returns a new state based on actions type.
- Common way is to use `switch` statements and not `if-else` statements.
- Define a default value of 0 for parameter `state`.
    - The reducer will work without having primed the state.
```js
const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        case "ZERO":
            return 0;
        default:    // If none of the above matches, code comes here.
            return state;
    }
};
```
- Reducer never supposed to be called directly from app code.
    - Only given as parameter to `createStore` function which creates the store.
```js
import { createStore } from "redux";

const counterReducer = (state = 0, action) => {
    // ...
};

const store = createStore(counterReducer);
```
- The store now uses the reducer to handle actions.
    - Actions are `dispatched` or sent to the store with the `dispatch` method.
```js
store.dispatch({ type: "INCREMENT" });
```
- Can find the state of the store using `getState`.
- For example:
```js
const store = createStore(counterReducer);
console.log(store.getState());
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
console.log(store.getState());
store.dispatch({ type: "ZERO" });
store.dispatch({ type: "DECREMENT" });
console.log(store.getState());
```
- The following is printed:
```
0
3
-1
```
- The third important method the store has is `subscribe`.
    - Used to create callback functions the store calls whenever an action is dispatched to the store.
    - We can add function to subscribe where every change in the store would be printed to the console.
```js
store.subscribe(() => {
    const storeNow = store.getState();
    console.log(storeNow);
});
```
- The code below:
```js
const store = createStore(counterReducer);

store.subscribe(() => {
    const storeNow = store.getState();
    console.log(storeNow);
});

store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "ZERO" });
store.dispatch({ type: "DECREMENT" });
```
- The following is printed:
```
1
2
3
0
-1
```
- Code for counter app is the following.
    - All code written to the same file `index.js`.
    - The `store` is straight available for the React code.
    - There is a better way to structure React/Redux code that we'll do later.
```js
import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";

const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        case "ZERO":
            return 0;
        default:
            return state;
    }
};

const store = createStore(counterReducer);

const App = () => {
    return (
        <div>
            <div>
                {store.getState()}
            </div>
            <button onClick={e => store.dispatch({ type: "INCREMENT" })}>plus</button>
            <button onClick={e => store.dispatch({ type: "DECREMENT" })}>minus</button>
            <button onClick={e => store.dispatch({ type: "ZERO" })}>zero</button>
        </div>
    );
};

const renderApp = () => {
    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
};

renderApp();
store.subscribe(renderApp);
```
- `App` renders value of counter by asking it from the store with `store.getState()`.
- Action handlers of the buttons dispatch the right actions to the store.
- When state of store is changed, React is not able to auto rerender the app.
    - We have registered a function `renderApp`.
    - Renders the whole app.
    - Listens for changes in the store with `store.subscribe`.
    - Note the immediate call to `renderApp` method.
        - Without this call, the first rendering of the app never happens.

