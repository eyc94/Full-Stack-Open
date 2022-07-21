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


#### Navigation Structure
- Alter app's navigation menu to use Bootstrap's `Navbar` component.
- React Bootstrap library provides us with matching built-in components.
- We now have a working solution:
```js
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
            <Nav.Link href="#" as="span">
                <Link style={padding} to="/">Home</Link>
            </Nav.Link>

            <Nav.Link href="#" as="span">
                <Link style={padding} to="/notes">Notes</Link>
            </Nav.Link>

            <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">Users</Link>
            </Nav.Link>

            <Nav.Link href="#" as="span">
                {user
                    ? <em style={padding}>{user} logged in</em>
                    : <Link style={padding} to="/login">Login</Link>
                }
            </Nav.Link>
        </Nav>
    </Navbar.Collapse>
</Navbar>
```
- Resulting layout is clean.
- If viewport is narrowed, menu collapses into a "hamburger".
- Bootstrap and majority of existing UI frameworks produce `responsive` designs.
    - Works on variety of different screen sizes.
- Chrome dev tools can help simulate our app in browser of different mobile clients.
- Complete code is here: `https://github.com/fullstack-hy2020/misc/blob/master/notes-bootstrap.js`


## Material UI
- Our second example looks into the `MaterialUI` React library.
    - Implements `Material design` visual language developed by Google.
- Install library:
```
$ npm install @mui/material @emotion/react @emotion/styled
```
- Add the following line to the `head` tag in `public/index.html` file.
    - The line loads Google's font `Roboto`.
```html
<head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    // ...
</head>
```
- Use MaterialUI to do the same modifications to code like we did with bootstrap.
- Render contents of whole app in `Container`:
```js
import { Container } from "@mui/material";

const App = () => {
    // ...
    return (
        <Container>
            // ...
        </Container>
    );
};
```
- Start with `Notes` component.
- Render list of notes as a `table`.
```js
const Notes = ({ notes }) => (
    <div>
        <h2>Notes</h2>

        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    {notes.map(note => (
                        <TableRow key={note.id}>
                            <TableCell>
                                <Link to={`/notes/${note.id}`}>{note.content}</Link>
                            </TableCell>
                            <TableCell>
                                {note.user}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
);
```
- Table looks better.
- Only downside is that you have to import so many things:
```js
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper
} from "@mui/material";
```

