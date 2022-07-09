import { useState } from "react";

const Blog = ({ blog, likeHandler }) => {
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

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {!showDetails ? "[" + blog.author + "]" : ""} <button onClick={viewHandler}>{showDetails ? "Hide" : "View"}</button>
                {showDetails ?
                    <>
                        <div>URL: {blog.url}</div>
                        <div>Likes: {blog.likes} <button onClick={likeHandler}>Like</button></div>
                        <div>Author: {blog.author}</div>
                    </>
                    : <div></div>
                }
            </div>
        </div>
    );
};

export default Blog;
