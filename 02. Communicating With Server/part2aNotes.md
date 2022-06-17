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


