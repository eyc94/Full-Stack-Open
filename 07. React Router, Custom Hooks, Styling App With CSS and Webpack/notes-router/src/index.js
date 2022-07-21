import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
    BrowserRouter as Router,
    Routes, Route, Link,
    Navigate,
    useParams,
    useNavigate,
    useMatch
} from "react-router-dom";
import Home from "./components/Home";
import Note from "./components/Note";
import Notes from "./components/Notes";

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

    const match = useMatch("/notes/:id");
    const note = match
        ? notes.find(note => note.id === Number(match.params.id))
        : null;

    return (
        <div className="container">
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
                <Route path="/notes/:id" element={<Note note={note} />} />
                <Route path="/notes" element={<Notes notes={notes} />} />
                <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
                <Route path="/login" element={<Login onLogin={login} />} />
                <Route path="/" element={<Home />} />
            </Routes>

            <div>
                <em>EC Notes App, 2022</em>
            </div>
        </div>

    );
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <Router>
        <App />
    </Router>,
    document.getElementById("root")
);
