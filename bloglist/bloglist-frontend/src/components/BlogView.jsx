import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  initializeBlogs,
  selectBlogById,
  likeBlog,
  deleteBlog,
  createComment,
} from "../redux/reducers/blogReducer";
import { Button, Form, ListGroup, Alert } from "react-bootstrap";

const BlogView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector((state) => selectBlogById(state, id));
  const user = useSelector((state) => state.user);

  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!blog) {
      dispatch(initializeBlogs());
    }
  }, [dispatch, blog]);

  if (!blog) {
    return <div>Loading blog details...</div>;
  }

  const handleLike = () => {
    dispatch(likeBlog(blog));
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${blog.title}?`)) {
      dispatch(deleteBlog(blog.id));
    }
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (comment) {
      dispatch(createComment(blog.id, comment));
      setComment("");
    }
  };

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
      <p>Author: {blog.author}</p>
      <p>Likes: {blog.likes}</p>
      <Button variant="primary" onClick={handleLike}>
        Like
      </Button>

      {user && blog.user.username === user.username && (
        <Button
          variant="danger"
          onClick={handleDelete}
          style={{ marginLeft: "10px" }}
        >
          Delete
        </Button>
      )}

      <h3 className="mt-4">Comments</h3>
      <ListGroup>
        {blog.comments.map((comment, index) => (
          <ListGroup.Item key={index}>{comment.content}</ListGroup.Item>
        ))}
      </ListGroup>

      <Form onSubmit={handleCommentSubmit} className="mt-3">
        <Form.Control
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <Button variant="success" type="submit" className="mt-2">
          Submit
        </Button>
      </Form>

      <div className="mt-4">
        <Link to="/blogs" className="btn btn-link">
          Back to blogs
        </Link>
      </div>
    </div>
  );
};

export default BlogView;
