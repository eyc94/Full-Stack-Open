import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const Home = () => (
    <div><h2>EC Notes App</h2></div>
);

const Notes = () => (
    <div><h2>Notes</h2></div>
);

const Users = () => (
    <div><h2>Users</h2></div>
);

const App = () => {
    const [page, setPage] = useState("home");

    const toPage = (page) => (event) => {
        event.preventDefault();
        setPage(page);
    };

    const content = () => {
        if (page === "home") {
            return <Home />;
        } else if (page === "notes") {
            return <Notes />;
        } else if (page === "users") {
            return <Users />;
        }
    };

    const padding = {
        padding: 5
    };

    return (
        <div>
            <div>
                <a href="" onClick={toPage("home")} style={padding}>Home</a>
                <a href="" onClick={toPage("notes")} style={padding}>Notes</a>
                <a href="" onClick={toPage("users")} style={padding}>Users</a>
            </div>

            {content()}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />, document.getElementById("root"));