import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("Renders blog title and author but not url or likes", () => {
    const blog = {
        title: "Sample Blog Title",
        author: "Sample Author",
        url: "https://www.google.com",
        likes: 10,
        user: {
            username: "echin",
            name: "Eric",
            id: "62c7e7ee9ff8b1bf39fdcf72"
        }
    };

    const user = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVjaGluIiwiaWQiOiI2MmM3ZTdlZTlmZjhiMWJmMzlmZGNmNzIiLCJpYXQiOjE2NTc0NTYwNjB9.CLCvJzk90RE6yR4Mq9N1BKLcnyZdx5SqjHyNN8Xkk_0",
        username: "echin",
        password: "password"
    };

    const mockLikeHandler = jest.fn();
    const mockRemoveHandler = jest.fn();

    const { container } = render(<Blog blog={blog} user={user} likeHandler={mockLikeHandler} removeHandler={mockRemoveHandler} />);
    const div = container.querySelector(".contents");
    expect(div).toHaveTextContent(`${blog.title} [${blog.author}]`);
    expect(div).not.toHaveTextContent(`${blog.url}`);
    expect(div).not.toHaveTextContent(`${blog.likes}`);
});
