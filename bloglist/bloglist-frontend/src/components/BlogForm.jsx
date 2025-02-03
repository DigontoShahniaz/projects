import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  const addBlog = async (event) => {
    event.preventDefault();

    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    });
    setNewBlog({ title: "", author: "", url: "" });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            value={newBlog.title}
            onChange={handleChange}
            placeholder="Enter blog title"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Author</Form.Label>
          <Form.Control
            name="author"
            value={newBlog.author}
            onChange={handleChange}
            placeholder="Enter blog author"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>URL</Form.Label>
          <Form.Control
            name="url"
            value={newBlog.url}
            onChange={handleChange}
            placeholder="Enter blog URL"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  );
};

export default BlogForm;
