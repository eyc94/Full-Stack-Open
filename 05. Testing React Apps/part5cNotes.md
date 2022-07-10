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


## Rendering The Component For Tests
- Write our test in `src/components/Note.test.js`.
    - Same directory as the component itself.
- First test verifies component renders the contents of the note:
```js
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Note from "./Note";

test("Renders content", () => {
    const note = {
        content: "Component testing is done with react-testing-library",
        important: true
    };

    render(<Note note={note} />);

    const element = screen.getByText("Component testing is done with react-testing-library");
    expect(element).toBeDefined();
});
```
- After initial configuration, the test renders the component with the `render` function provided by the react-testing-library.
- Normally React components are rendered to the DOM.
- The render method we used renders the components in a format suitable for tests without rendering to DOM.
- Can use the `screen` object to access rendered component.
- Use screen's method `getByText` to search for an element that has the note content and ensure that it exists.


## Running Tests
- CRA configures tests to be run in watch mode by default.
- This means `npm test` command will not exit once the tests have finished.
- It will wait for changes to be made to the code.
- Once new changes are saved, the tests are auto executed and the cycle repeats.
- If you want to run tests normally, do it like this:
```
$ CI=true npm test
```
- Console may issue warning if you do not have Watchman installed.
- Watchman watches for changes made to files.
- Program speeds up execution of tests.
- Starting from macOS Sierra, running tests in watch mode issues some warnings to console.
    - Can be removed by installing `Watchman`.
    - `https://facebook.github.io/watchman/`


