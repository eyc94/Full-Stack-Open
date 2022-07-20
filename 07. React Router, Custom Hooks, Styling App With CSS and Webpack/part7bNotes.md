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

