# Adding Styles To React App
- Our app appearance is modest.
- Add styles to React applications.
- First add styles to our app the old-school way.
    - Single file without using a `CSS preprocessor`.
- Add a new `index.css` file under the `src` folder.
    - Add to application by putting this line in `index.js`:
```javascript
import "./index.css";
```
- Add the following rule:
```css
h1 {
    color: green;
}
```
- May need to refresh browser to see the changes.
- CSS has `selectors` and `declarations`.
    - The selectors define the elements the rule should be applied to.
    - The selector is `h1`.
        - This matches all `h1`.
- The above sets the `color` property to `green`.
- One rule can have a lot of properties.
- Modify the previous to have text cursive.
```css
h1 {
    color: green;
    font-style: italic;
}
```
- Many ways of matching elements using different CSS selectors.
- Target each one of the notes with our styles.
    - Use the selector `li` because all are wrapped in this tag.
- Add the following rule to style sheet
```css
li {
    color: grey;
    padding-top: 3px;
    font-size: 15px;
}
```
- Sometimes this is problematic because it's not specific and applies to all `li` tags.
- Better to use `class selectors`.
- In regular HTML, classes are defined like:
```html
<li class="note">some text...</li>
```
- In React, we use `className` attribute instead.
- Change `Note` component:
```javascript
const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? "make not important"
        : "make important";
    
    return (
        <li className="note">
            {note.content}
            <button onClick={toggleImportance}>{label}</label>
        </li>
    );
};
```
- Class selectors use the `.class` syntax:
```css
.note {
    color: grey;
    padding-top: 5px;
    font-size: 15px;
}
```


## Improved Error Message
- We displayed an error message when user tries to toggle importance of a deleted note.
    - Used `alert` method.
    - Implement error message as its own React component.
```javascript
const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className="error">
            {message}
        </div>
    );
};
```
- If `message` is `null`, nothing is rendered.
- Otherwise, the message gets rendered.
- Add new piece of state called `errorMessage` to `App`.
    - Initialize it with some error message.
```javascript
const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState("some error happened...");

    // ...

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            // ...
        </div>
    );
};
```
- Add a style that suits errors:
```css
.error {
    color: red;
    background: lightgrey;
    font-size: 20px;
    border-style: solid;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}
```
- Now, add logic to display error message.
- Change the `toggleImportanceOf` function:
```javascript
const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
        .update(id, changedNote)
        .then(returnedNote => {
            setNotes(notes.map(note => note.id !== id ? note : returnedNote));
        })
        .catch(error => {
            setErrorMessage(
                `Note "${note.content}" was already removed from the server!`
            );
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
            setNotes(notes.filter(n => n.id !== id));
        });
};
```
- When error occurs, we add a message to the `errorMessage` state.
- Then, we start a timer that sets the `errorMessage` to `null` after 5 seconds.


