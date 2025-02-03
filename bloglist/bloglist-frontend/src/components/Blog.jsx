import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

const Blog = ({ blog, user }) => {
  return (
    <Table striped bordered hover responsive>
      <tbody>
        <tr>
          <td>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Blog;
