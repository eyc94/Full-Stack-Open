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


## Tests For The Togglable Component
- Write a few tests for `Togglable` component.
- Add the `togglableContent` CSS classname to the div that returns child components.
```js
const Togglable = forwardRef((props, ref) => {
    // ...

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>
                    {props.buttonLabel}
                </button>
            </div>
            <div style={showWhenVisible} className="togglableContent">
                {props.children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </div>
    )
})
```
- The tests are shown below:
```js
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Note from "./Note";

describe("<Togglable />", () => {
    let container;

    beforeEach(() => {
        container = render(
            <Togglable buttonLabel="Show...">
                <div className="testDiv">
                    Togglable content
                </div>
            </Togglable>
        ).container;
    });

    test("renders its children", () => {
        screen.findAllByText("Togglable content");
    });

    test("At start the children are not displayed", () => {
        const div = container.querySelector(".togglableContent");
        expect(div).toHaveStyle("display: none");
    });

    test("After clicking the button, children are displayed", async () => {
        const user = userEvent.setup();
        const button = screen.getByText("Show...");
        await user.click(button);

        const div = container.querySelector(".togglableContent");
        expect(div).not.toHaveStyle("display: none");
    });
});
```
- The `beforeEach` function gets called before each test.
    - Renders the `Togglable` component.
    - Saves the field `container` of the return value.
- First test verifies that the `Togglable` component renders its child component.
- The tests use the `toHaveStyle` method to verify the child component of `Togglable` is not visible initially.
    - Done by checking the style of `div` element contains `{ display: "none" }`.
- Another test verifies the component is visible after button press.
    - Style for hiding component is no longer assigned to component.
- Add a test used to verify that the visible content can be hidden by clicking the second button of component.
```js
describe("<Togglable />", () => {
    
    // ...

    test("Toggled content can be closed", async () => {
        const user = userEvent.setup();
        const button = screen.getByText("Show...");
        await user.click(button);

        const closeButton = screen.getByText("Cancel");
        await user.click(closeButton);

        const div = container.querySelector(".togglableContent");
        expect(div).toHaveStyle("display: none");
    });
});
```


## Testing The Forms
- Can simulate text input with `userEvent`.
- Make a test for `NoteForm` component.
- The code of the component is below:
```js
import { useState } from "react";

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState("");

    const handleChange = (event) => {
        setNewNote(event.target.value);
    };

    const addNote = (event) => {
        event.preventDefault();
        createNote({
            content: newNote,
            important: Math.random() > 0.5
        });

        setNewNote("");
    };

    return (
        <div className="formDiv">
            <h2>Create A New Note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default NoteForm;
```
- Our form works by calling `createNote` function received as props with the details of the new note.
- The test is below:
```js
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteForm from "./NoteForm";

test("<NoteForm /> updates parent state and calls onSubmit", async () => {
    const createNote = jest.fn();
    const user = userEvent.setup();

    render(<NoteForm createNote={createNote} />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByText("Save");

    await user.type(input, "Testing a form...");
    await user.click(sendButton);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe("Testing a form...");
});
```
- Tests gets access to input field by function `getByRole`.
- Method `type` of `userEvent` is used to write text to input field.
- First expect tests that submitting form calls `createNote` method.
- Second expect tests that event handler is called with the right parameters.
    - A note with correct content is created when form is filled.


## About Finding The Elements
- Assume the form has two input fields.
```js
const NoteForm = ({ createNote }) => {
    // ...

    return (
        <div className="formDiv">
            <h2>Create A New Note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                />
                <input
                    value={...}
                    onChange={...}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};
```
- Approach our test uses to find input field results in an error:
```js
const input = screen.getByRole("textbox");
```
- Suggests to use `getAllByRole`.
```js
const inputs = screen.getAllByRole("textbox");
await user.type(inputs[0], "Testing a form...");
```
- The method returns an array of input fields.
    - However, this relies on the order of input fields.
- Often, input fields have a `placeholder` text that hints what kind of input is expected.
- Add placeholder to form.
```js
const NoteForm = ({ createNote }) => {
    // ...

    return (
        <div className="formDiv">
            <h2>Create A New Note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                    placeholder="Write here note content"
                />
                <input
                    value={...}
                    onChange={...}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};
```
- Finding the correct input field is easy with `getByPlaceholderText`.
```js
test("<NoteForm /> updates parent state and calls onSubmit", async () => {
    const createNote = jest.fn();

    render(<NoteForm createNote={createNote} />);

    const input = screen.getByPlaceholderText("Write here note content");
    const sendButton = screen.getByText("Save");

    await user.type(input, "Testing a form...");
    await user.click(sendButton);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe("Testing a form...");
});
```
- Most flexible way of finding elements in tests is the method `querySelector` of the `container` object.
    - Returned by `render`.
    - Any CSS selector can be used with this method for searching elements in tests.
- Consider we would define a unique `id` to the input field:
```js
const NoteForm = ({ createNote }) => {
    // ...

    return (
        <div className="formDiv">
            <h2>Create A New Note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                    id="note-input"
                />
                <input
                    value={...}
                    onChange={...}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};
```
- The input element can be found in the test like:
```js
const { container } = render(<NoteForm createNote={createNote} />);
const input = container.querySelector("#note-input");
```
- Just stick to the approach of using `getByPlaceholderText` in the test.
- Look at a couple details before moving on.
- Assume a component would render text to an HTML element like so:
```js
const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? "Make not important" : "Make important";

    return (
        <li className="note">
            Your awesome note: {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    );
};

export default Note;
```
- The `getByText` command does not find the element.
```js
test("Renders content", () => {
    const note = {
        content: "Does not work anymore :(",
        important: true
    };

    render(<Note note={note} />);
    const element = screen.getByText("Does not work anymore :(");
    expect(element).toBeDefined();
});
```
- Command `getByText` looks for an element with the **same text** it has as a parameter.
- If we want to look for an element that *contains* the text, add the option:
```js
const element.getByText(
    "Does not work anymore :(", { exact: false }
);
```
- Or, use command `findByText`:
```js
const element = await screen.findByText("Does not work anymore :(");
```
- Notice that `findByText` returns a promise.
- Situations where `queryByText` is useful.
    - Returns an element but does not cause an exception if element is not found.
    - Could use command to ensure that something is not rendered to the component:
```js
test("Does not render this", () => {
    const note = {
        content: "This is a reminder",
        important: true
    };

    render(<Note note={note} />);

    const element = screen.queryByText("Do not want this thing to be rendered");
    expect(element).toBeNull();
});
```


## Test Coverage
- Find out `coverage` of our tests by running with command:
```
CI=true npm test -- --coverage
```


