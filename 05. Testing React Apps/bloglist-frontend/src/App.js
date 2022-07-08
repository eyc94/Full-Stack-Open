import { useState, useEffect } from "react";
import Blog from "./components/Blog";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const [newTitle, setNewTitle] = useState("");
    const [newAuthor, setNewAuthor] = useState("");
    const [newUrl, setNewUrl] = useState("");

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        );
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        const user = await loginService.login({
            username, password
        });

        window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

        blogService.setToken(user.token);
        setUser(user);
        setUsername("");
        setPassword("");
    };

    const handleLogout = () => {
        window.localStorage.removeItem("loggedBlogappUser");
        setUser(null);
    };

    const loginForm = () => (
        <>
            <h2>Log Into Application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    Username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    Password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </>
    );

    const addBlog = async (event) => {
        event.preventDefault();

        const newBlog = {
            title: newTitle,
            author: newAuthor,
            url: newUrl
        };

        blogService
            .create(newBlog)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog));
            });

        setNewTitle("");
        setNewAuthor("");
        setNewUrl("");
    };

    return (
        <div>
            {user === null ?
                loginForm() :
                <div>
                    <h2>Blogs</h2>
                    <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
                    <form onSubmit={addBlog}>
                        <div>
                            title:
                            <input
                                type="text"
                                value={newTitle}
                                onChange={({ target }) => setNewTitle(target.value)}
                            />
                        </div>
                        <div>
                            author:
                            <input
                                type="text"
                                value={newAuthor}
                                onChange={({ target }) => setNewAuthor(target.value)}
                            />
                        </div>
                        <div>
                            url:
                            <input
                                type="text"
                                value={newUrl}
                                onChange={({ target }) => setNewUrl(target.value)}
                            />
                        </div>
                        <button type="submit">Create</button>
                    </form>
                    {blogs.map(blog =>
                        <Blog key={blog.id} blog={blog} />
                    )}
                </div>
            }
        </div>
    );
};

export default App;
