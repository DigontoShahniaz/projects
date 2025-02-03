import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { initializeUsers, selectUserById } from "../redux/userSlice";
import { Table } from "react-bootstrap"; // Import the Table component from react-bootstrap

const UserView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => selectUserById(state, id));

  useEffect(() => {
    if (!user) {
      dispatch(initializeUsers());
    }
  }, [dispatch, user]);

  if (!user) {
    return <div>Loading user details...</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Blog Title</th>
          </tr>
        </thead>
        <tbody>
          {user.blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserView;
