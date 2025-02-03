import { createSlice } from "@reduxjs/toolkit";
import blogService from "../../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog,
      );
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
    addCommentToBlog(state, action) {
      const { blogId, comment } = action.payload;
      const blog = state.find((blog) => blog.id === blogId);
      if (blog) {
        return state.map((b) =>
          b.id === blogId
            ? { ...b, comments: [...b.comments, comment] } // Ensure we return a new object
            : b,
        );
      }
      return state;
    },
  },
});

export const { setBlogs, addBlog, updateBlog, removeBlog, addCommentToBlog } =
  blogSlice.actions;

export const initializeBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll();
  dispatch(setBlogs(blogs));
};

export const selectBlogById = (state, id) =>
  state.blogs.find((blog) => blog.id === id);

export const createBlog = (blog) => async (dispatch) => {
  const newBlog = await blogService.create(blog);
  dispatch(addBlog(newBlog));
};

export const likeBlog = (blog) => async (dispatch) => {
  try {
    const updatedBlog = await blogService.update(blog.id, {
      likes: blog.likes + 1,
    });
    dispatch(updateBlog(updatedBlog));
  } catch (error) {
    console.error("Error liking blog:", error);
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  await blogService.remove(id);
  dispatch(removeBlog(id));
};

export const createComment = (blogId, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.createComment(blogId, comment);
    dispatch(
      addCommentToBlog({
        blogId,
        comment: updatedBlog.comments[updatedBlog.comments.length - 1],
      }),
    );
  };
};

export default blogSlice.reducer;
