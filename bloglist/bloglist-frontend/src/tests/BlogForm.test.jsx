import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // <-- Add this import
import BlogForm from "../components/BlogForm";

test.only("calls createBlog with correct details when a new blog is created", async () => {
  const mockHandler = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={mockHandler} />);

  const titleInput = screen.getByPlaceholderText("Enter blog title");
  const authorInput = screen.getByPlaceholderText("Enter blog author");
  const urlInput = screen.getByPlaceholderText("Enter blog url");

  await user.type(titleInput, "React Testing with Vitest");
  await user.type(authorInput, "John Doe");
  await user.type(urlInput, "http://test.com");

  const createButton = screen.getByText("Create");
  await user.click(createButton);

  expect(mockHandler).toHaveBeenCalledWith({
    title: "React Testing with Vitest",
    author: "John Doe",
    url: "http://test.com",
  });
});
