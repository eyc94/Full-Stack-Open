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

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {!showDetails ? "[" + blog.author + "]" : ""} <button onClick={viewHandler}>{showDetails ? "Hide" : "View"}</button>
                {showDetails ?
                    <>
                        <div>URL: {blog.url}</div>
                        <div>Likes: {blog.likes} <button onClick={likeHandler}>Like</button></div>
                        <div>Author: {blog.author}</div>
                        <div><button style={showIfAuthor} onClick={removeHandler}>Remove</button></div>
                    </>
                    : <div></div>
                }
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
