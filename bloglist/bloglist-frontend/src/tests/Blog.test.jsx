import { render, screen } from "@testing-library/react";
import Blog from "../components/Blog";
import userEvent from "@testing-library/user-event";

test("renders blog title and author but not URL or likes by default", () => {
  const blog = {
    title: "Testing in React",
    author: "John Doe",
    url: "http://test.com",
    likes: 10,
    user: {
      username: "johndoe",
      name: "John Doe",
    },
  };

  const { container } = render(<Blog blog={blog} user={blog.user} />);

  expect(container).toHaveTextContent("Testing in React");
  expect(container).toHaveTextContent("John Doe");

  const url = screen.queryByText("http://test.com");
  const likes = screen.queryByText("Likes: 10");
  expect(url).not.toBeInTheDocument();
  expect(likes).not.toBeInTheDocument();
});

test("displays URL and likes when the view button is clicked", async () => {
  const blog = {
    title: "Testing in React",
    author: "John Doe",
    url: "http://test.com",
    likes: 0,
    user: {
      username: "johndoe",
      name: "John Doe",
    },
  };

  render(<Blog blog={blog} user={blog.user} />);
  const user = userEvent.setup();

  expect(screen.queryByText("http://test.com")).not.toBeInTheDocument();
  expect(screen.queryByText("Likes: 0")).not.toBeInTheDocument();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  expect(screen.getByText("http://test.com")).toBeInTheDocument();

  const likes = screen.getByTestId("like-button");
  expect(likes).toHaveTextContent("Likes: 0");
});
