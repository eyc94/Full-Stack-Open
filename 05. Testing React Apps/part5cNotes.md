# Testing React Apps
- Many ways to test React apps.
- Tests will be implemented with the same `Jest` testing library developed by Facebook.
- Jest is configured by default to apps created with `create-react-app`.
- We also need another testing library that helps render components for testing purposes.
- Best option is `react-testing-library`.
- Install library:
```
$ npm install --save-dev @testing-library/react @testing-library/jest-dom
```
- Also installed `jest-dom`.
    - Provides nice Jest related helper methods.
- Write some tests for the component that is responsible for rendering a note:
```js
const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? "make not important"
        : "make important";

    return (
        <li className="note">
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    );
};
```
- The `li` element has class of `note`.
    - Can be used to access the component in our tests.


