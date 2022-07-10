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


## Test File Location
- In React there are at least two different conventions for test file's location.
- We created test file in the same directory as the component being tested.
- Other convention is to store the test files in their own separate directory.
- The first convention is configured by default in apps created by `create-react-app`.


## Searching For Content In A Component
- The react-testing-library package offers many ways to investigate content of component.
- The `expect` method is not needed at all.
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
- The test fails if `getByText` does not find the element it is looking for.
- Could use `CSS-selectors` to find rendered eleemnts by using the method `querySelector` of the object `container` that is one of the fields returned by the render:
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

    const { container } = render(<Note note={note} />);

    const div = container.querySelector(".note");
    expect(div).toHaveTextContent("Component testing is done with react-testing-library");
});
```
- There are other methods like `getByTestId`.
    - Looks for elements based on id-attributes.


## Debugging Tests
- We can run into different problems when running tests.
- The object `screen` has a method `debug` that can be used to print the HTML of a component to terminal.
- Change the test:
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

    screen.debug();

    // ...
});
```
- The HTML gets printed to the console.
```
console.log
    <body>
        <div>
            <li
                class="note"
            >
                Component testing is done with react-testing-library
                <button>
                    Make not important
                </button>
            </li>
        </div>
    </body>
```
- Can also use the same method to print a wanted element to console:
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

    screen.debug(element);

    expect(element).toBeDefined();
});
```
- The HTML of the wanted element gets printed.
```
<li
    class="note"
>
    Component testing is done with react-testing-library
    <button>
        Make not important
    </button>
</li>
```


## Clicking Buttons In Tests
- The `Note` component also makes sure that when the button associated with the note is pressed, the `toggleImportance` event handler function gets called.
- Install library `user-event` that makes simulating user input easier:
```
$ npm install --save-dev @testing-library/user-event
```
- At the moment of writing (Jan 28, 2022), there is a mismatch between the version of a dependency `jest-watch-typeahead` that `create-react-app` and `user-event` are using.
- Problem fixed by installing:
```
$ npm install -D --exact jest-watch-typeahead@0.6.5
```
- Testing functionality is like this:
```js
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Note from "./Note";

// ...

test("Clicking the button calls event handler once", async () => {
    const note = {
        content: "Component testing is done with react-testing-library",
        important: true
    };

    const mockHandler = jest.fn();

    render(<Note note={note} toggleImportance={mockHandler} />);

    const user = userEvent.setup();
    const button = screen.getByText("Make not important");
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(1);
});
```
- The event handler is a `mock` function defined with Jest.
- A `session` is started to interact with the rendered component.
- The test finds button based on text from the rendered component and clicks the element.
- Clicking happens with `click` method of `userEvent` library.
- Expectation of test is that the `mock function` is called exactly once.
- `Mock objects and functions` are commonly used stub components in testing used for replacing dependencies of the components being tested.
    - Mocks make it possible to return hardcoded responses.
    - To verify the number of times the mock functions are called.
    - And with what parameters.



