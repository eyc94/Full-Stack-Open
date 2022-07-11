import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> Tests blog form and blog creation", async () => {
    const createBlog = jest.fn();
    const user = userEvent.setup();

    const { container } = render(<BlogForm createBlog={createBlog} />);

    const title = container.querySelector("#title");
    const author = container.querySelector("#author");
    const url = container.querySelector("#url");
    const createButton = screen.getByText("Create");

    await user.type(title, "Sample Blog 1");
    await user.type(author, "Eric");
    await user.type(url, "https://www.google.com");
    await user.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("Sample Blog 1");
});
