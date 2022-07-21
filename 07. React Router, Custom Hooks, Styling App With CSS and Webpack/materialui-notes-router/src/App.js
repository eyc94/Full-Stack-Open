import React, { useState } from "react";
import {
    Routes, Route, Link,
    Navigate,
    useMatch
} from "react-router-dom";
import Home from "./components/Home";
import Note from "./components/Note";
import Notes from "./components/Notes";
import Users from "./components/Users";
import Login from "./components/Login";
import { Container, Alert } from "@mui/material";

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
    const [message, setMessage] = useState(null);

    const login = (user) => {
        setUser(user);
        setMessage(`Welcome ${user}`);
        setTimeout(() => {
            setMessage(null);
        }, 10000);
    };

    const padding = {
        padding: 5
    };

    const match = useMatch("/notes/:id");
    const note = match
        ? notes.find(note => note.id === Number(match.params.id))
        : null;

    return (
        <Container>
            <div className="container">
                {(message &&
                    <Alert severity="success">
                        {message}
                    </Alert>
                )}

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
                                    ? <em style={padding}>{user} loggged in</em>
                                    : <Link style={padding} to="/login">Login</Link>
                                }
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

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
        </Container>
    );
};

export default App;
