# Rendering A Collection, Modules
- Recap some topics.


## console.log()
- Always a good idea to log things to check values.
- Separate values in `console.log()` with a comma.
    - Do not concatenate!


## Protip: Visual Studio Code Snippets
- Easy to create snippets.
    - Shortcuts for generating re-used portions of code.
    - Like `sout` in Netbeans.
- Snippet for `console.log()` is `clog`.
```json
{
    "console.log": {
        "prefix": "clog",
        "body": [
            "console.log('$1')"
        ],
        "description": "log output to console"
    }
}
```
- VSCode has a builtin snippet though.
    - Type `log` and hit tab to autocomplete.


## JavaScript Arrays
- We will use functional programming methods of `array`.
    - `find`, `filter`, and `map`.
- Can watch first three parts of YouTube series `Functional Programming in JavaScript`.
    - `https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84`
    - Higher-order functions.
    - Map.
    - Reduce basics.


## Event Handlers Revisited
- It's worth going back to read about event handlers as it has proven to be difficult.


## Rendering Collections
- We now do the `frontend` or browser-side application logic.
- Start with `App.js`:
```javascript
const App = (props) => {
    const { notes } = props;

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                <li>{notes[0].content}</li>
                <li>{notes[1].content}</li>
                <li>{notes[2].content}</li>
            </ul>
        </div>
    );
};

export default App;
```
- The file `index.js` looks like:
```javascript
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
];

ReactDOM.createRoot(document.getElementById("root")).render(
    <App notes={notes} />
);
```
- Every note has an id, content, date, and an important flag.
- We use hard-coded index numbers for the array values because we know there are exactly three notes.
- We can improve this using the `map` function:
```javascript
notes.map(note => <li>{note.content}</li>);
```
- The result of this is an array of `li` elements.
```javascript
[
    <li>HTML is easy</li>,
    <li>Browser can execute only JavaScript</li>,
    <li>GET and POST are the most important methods of HTTP protocol</li>
]
```
- We can place these inside `ul` tags:
```javascript
const App = (props) => {
    const { notes } = props;

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => <li>{note.content}</li>)}
            </ul>
        </div>
    );
};
```
- Code generating `li` tags is JavaScript.
    - Wrap in curly braces in JSX template like all other JavaScript code.
- Make code more readable:
```javascript
const App = (props) => {
    const { notes } = props;

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <li>
                        {note.content}
                    </li>
                )}
            </ul>
        </div>
    );
};
```


## Key-Attribute
- App works but there's a warning.
    - *Each child in an array or iterator should have a unique "key" prop.*
- The elements generated by `map` must have unique key value.
    - Attribute called `key`.
```javascript
const App = (props) => {
    const { notes } = props;

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <li key={note.id}>
                        {note.content}
                    </li>
                )}
            </ul>
        </div>
    );
};
```
- React uses the key-attribute to determine how to update view generated by component when component is re-rendered.


## Map
- Understanding the `map` method is crucial.
- App contains an array called `notes`.
```javascript
const notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
];
```
- Examine how `map` works.
- If the following is add to the end of the file.
```javascript
const result = notes.map(note => note.id);
console.log(result);
```
- [1, 2, 3] will be printed to the console.
- `map` always creates a new array.
    - The new elements are created from the elements of the original array by *mapping*.
    - This is done by using the function given as a parameter to the `map` method.
- The function is:
```javascript
note => note.id;
```
- This is an arrow function in the compact form.
- The full form is:
```javascript
(note) => {
    return node.id;
}
```
- Basically, the function gets a note object as a parameter and returns the value of the `id` field.
- Changing the command to:
```javascript
const result = notes.map(note => note.content);
```
- This results in an array with the note's content.
- This is close to the React code we used:
```javascript
notes.map(note =>
    <li key={note.id}>{note.content}</li>
);
```
- This generates an `li` tag containing the note's content.
- This needs to be in curly braces.


## Anti-Pattern: Array Indexes As Keys
- We can use the array indexes as keys as well.
- Indexes can be retrieved by passing a second parameter to the callback function of the `map` method.
```javascript
notes.map((note, i) => ...);
```
- The value `i` is the index of the position in the array where the note is.
- One way to define row generation is:
```javascript
<ul>
    {notes.map((note, i) =>
        <li key={i}>
            {note.content}
        </li>
    )}
</ul>
```
- This method is not recommended.


## Refactoring Modules
- Tidy up the code.
- Only interested in the field `notes` of the props.
- Use destructuring.
```javascript
const App = ({ notes }) => {
    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <li key={note.id}>
                        {note.content}
                    </li>
                )}
            </ul>
        </div>
    );
};
```
- Separate single note into its own component `Note`.
```javascript
const Note = ({ note }) => {
    return (
        <li>{note.content}</li>
    );
};

const App = ({ notes }) => {
    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>
        </div>
    );
};
```
- Note that the `key` attribute is now in the `Note` component.
- Common practice is to declare each component in their own file as an ES6-module.
- We have been using modules this whole time.
- First few lines of `index.js`:
```javascript
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
```
- We see it imports three modules.
- The `react` module is placed into the `React` variable.
- The `react-dom/client` module is placed into the `ReactDOM` variable.
- The module that defines the main app is placed into the variable `App`.
- Move `Note` into its own module.
    - Components usually placed in directory called `components`.
    - This folder is then placed in `src`.
    - Name the file after the component.
- Create a folder called `components` and place a file called `Note.js` inside.
```javascript
import React from "react";

const Note = ({ note }) => {
    return (
        <li>{note.content}</li>
    );
};

export default Note;
```
- The last line exports the declared module.
- The file using the component `App.js` can import the module.
```javascript
import Note from "./components/Note";

const App = ({ notes }) => {
    // ...
};
```
- The component exported by the module is now available for use in the variable `Note`.
- Location of the component must be given in relation to the importing file.
- Extension of the file can be omitted.


## When The Application Breaks
- Use `console.log()`.

