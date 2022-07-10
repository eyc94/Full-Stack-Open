import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, user, likeHandler, removeHandler }) => {
    const [showDetails, setShowDetails] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5
    };

    const viewHandler = () => {
        setShowDetails(!showDetails);
    };

    const showIfAuthor = { display: blog.user.username === user.username ? "" : "none" };
    const showWhenShown = { display: showDetails ? "" : "none" };
    const hideWhenShown = { display: showDetails ? "none" : "" };

    return (
        <div style={blogStyle}>
            <div style={hideWhenShown}>
                <div className="contents">
                    {blog.title} {!showDetails ? "[" + blog.author + "]" : ""} <button onClick={viewHandler}>View</button>
                </div>
            </div>
            <div style={showWhenShown}>
                <div>
                    <div>Title: {blog.title} <button onClick={viewHandler}>Hide</button></div>
                    <div>URL: {blog.url}</div>
                    <div>Likes: {blog.likes} <button onClick={likeHandler}>Like</button></div>
                    <div>Author: {blog.author}</div>
                    <div><button style={showIfAuthor} onClick={removeHandler}>Remove</button></div>
                </div>
            </div>
        </div>
    );
};

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    likeHandler: PropTypes.func.isRequired,
    removeHandler: PropTypes.func.isRequired
};

export default Blog;
