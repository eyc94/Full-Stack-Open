const Blog = ({ blog }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5
    };

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} [{blog.author}] <button>View</button>
            </div>
        </div>
    );
};

export default Blog;
