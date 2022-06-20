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


