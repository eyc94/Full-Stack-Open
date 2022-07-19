import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
    BrowserRouter as Router,
    Routes, Route, Link,
    Navigate,
    useParams,
    useNavigate
} from "react-router-dom";

const Home = () => (
    <div>
        <h2>EC Notes App</h2>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
    </div>
);

const Note = ({ notes }) => {
    const id = useParams().id;
    const note = notes.find(n => n.id === Number(id));
    return (
        <div>
            <h2>{note.content}</h2>
            <div>{note.user}</div>
            <div><strong>{note.important ? "important" : ""}</strong></div>
        </div>
    );
};

const Notes = ({ notes }) => (
    <div>
        <h2>Notes</h2>
        <ul>
            {notes.map(note =>
                <li key={note.id}>
                    <Link to={`/notes/${note.id}`}>{note.content}</Link>
                </li>
            )}
        </ul>
    </div>
);

const Users = () => (
    <div>
        <h2>Users</h2>
        <ul>
            <li>John Doe</li>
            <li>Jane Doe</li>
            <li>Sample Name</li>
        </ul>
    </div>
);

const Login = (props) => {
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        props.onLogin("jdoe");
        navigate("/");
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    Username: <input />
                </div>
                <div>
                    Password: <input type="password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

const App = () => {
    const [notes, setNotes] = useState([
        {
            id: 1,
            content: "HTML is easy",
            important: true,
            user: "Jane Doe"
        },
        {
            id: 2,
            content: "Browser can execute only JavaScript",
            important: false,
            user: "John Doe"
        },
        {
            id: 3,
            content: "Most important methods of HTTP-protocol are GET and POST",
            important: true,
            user: "Sample Name"
        }
    ]);

    const [user, setUser] = useState(null);

    const login = (user) => {
        setUser(user);
    };

    const padding = {
        padding: 5
    };

    return (
        <div>
            <Router>
                <div>
                    <Link style={padding} to="/">Home</Link>
                    <Link style={padding} to="/notes">Notes</Link>
                    <Link style={padding} to="/users">Users</Link>
                    {user
                        ? <em>{user} logged in</em>
                        : <Link style={padding} to="/login">Login</Link>
                    }
                </div>

                <Routes>
                    <Route path="/notes/:id" element={<Note notes={notes} />} />
                    <Route path="/notes" element={<Notes notes={notes} />} />
                    <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
                    <Route path="/login" element={<Login onLogin={login} />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
            <div>
                <br />
                <i>EC Notes App, 2022</i>
            </div>
        </div>

    );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />, document.getElementById("root"));
