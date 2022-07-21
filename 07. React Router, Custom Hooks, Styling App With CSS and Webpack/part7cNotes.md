# More About Styles
- Learned about adding styles to application.
    - First way is in a CSS file.
    - The other was inline.
- We will learn a new way.


## Ready-Made UI Libraries
- Can use ready-made UI frameworks.
- One popular UI library is `Bootstrap` created by Twitter.
- So many UI frameworks now.
- Few different React versions of Bootstrap like `reactstrap` and `react-bootstrap`.
- We will take a look at two UI frameworks.
    - Bootstrap and `MaterialUI`.
- We use both frameworks to add styles to apps we made in `React Router` section.


## React Bootstrap
- Start with Bootstrap.
- Look at the `react-bootstrap` package.
- Install the package:
```
$ npm install react-bootstrap
```
- Add a link for loading CSS stylesheet for Bootstrap inside the `head` tag in `public/index.html` file of the app:
```html
<head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossOrigin="anonymous"
    />
    // ...
</head>
```
- When reloading the app, it looks more stylish.
- In Bootstrap, all content are rendered inside of a `container`.
    - This is done by giving the root `div` element of the app the `container` class attribute:
```js
const App = () => {
    // ...

    return (
        <div className="container">
            // ...
        </div>
    );
};
```
- Notice the app does not go all the way to the edges.
- Make changes to the `Notes` component.
    - Render the list of notes as a `table`.
    - React Bootstrap has a built-in `Table` component.
```js
const Notes = ({ notes }) => {
    <div>
        <h2>Notes</h2>
        <Table striped>
            <tbody>
                {notes.map(note =>
                    <tr key={note.id}>
                        <td>
                            <Link to={`/notes/${note.id}`}>
                                {note.content}
                            </Link>
                        </td>
                        <td>
                            {note.user}
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>
};
```
- Appearance of app is stylish.
- The React Bootstrap components need to be imported:
```js
import { Table } from "react-bootstrap";
```


#### Forms
- Improve form in `Login` view with help of Bootstrap `forms`.
- React Bootstrap provides built-in `components` for creating forms.
    - Documentation is slightly lacking.
```js
let login = (props) => {
    // ...
    return (
        <div>
            <h2>Login</h2>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="text" name="username" />
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" />
                    <Button variant="primary" type="submit">Login</Button>
                </Form.Group>
            </Form>
        </div>
    );
};
```
- Number of components to import increases:
```js
import { Table, Form, Button } from "react-bootstrap";
```
- Our app is now improved.


#### Notification
- Improve our app's notification.
- Add a message for notification when a user logs into the app.
- Store it in the `message` variable in the `App` component's state:
```js
const App = () => {
    const [notes, setNotes] = useState([
        // ...
    ]);

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(null);

    const login = (user) => {
        setUser(user);
        setMessage(`Welcome ${user}`);
        setTimeout(() => {
            setMessage(null);
        }, 10000);
    };

    // ...
};
```
- We render message as a Bootstrap `Alert` component.
- The React Bootstrap library provides us with a matching React component:
```js
<div className="container">
    {(message &&
        <Alert variant="success">
            {message}
        </Alert>
    )}
    // ...
</div>
```

