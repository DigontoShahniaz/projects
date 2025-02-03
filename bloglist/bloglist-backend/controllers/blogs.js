const jwt = require("jsonwebtoken");
const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const userExtractor = require("../utils/middleware").userExtractor;

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

router.post("/", userExtractor, async (request, response) => {
  const blog = new Blog(request.body);

  const user = request.user;

  if (!user) {
    return response.status(403).json({ error: "user missing" });
  }

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  blog.likes = blog.likes | 0;
  blog.user = user;
  user.blogs = user.blogs.concat(blog._id);

  await user.save();

  const savedBlog = await blog.save();

  response.status(201).json(savedBlog);
});

router.post("/:id/comments", async (request, response) => {
  const { content } = request.body;

  if (!content || content.trim() === "") {
    return response.status(400).json({ error: "content missing" });
  }

  try {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    const comment = {
      content,
      date: new Date(),
    };

    blog.comments = blog.comments.concat(comment);
    const updatedBlog = await blog.save();
    response.status(201).json(updatedBlog);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    response.status(500).json({ error: "server error" });
  }
});

router.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(204).end();
  }

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: "user not authorized" });
  }

  await blog.deleteOne();

  user.blogs = user.blogs.filter(
    (b) => b._id.toString() !== blog._id.toString(),
  );

  await user.save();

  response.status(204).end();
});

router.put("/:id", async (request, response) => {
  const body = request.body;

  try {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: body.user,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    }).populate("user", { username: 1, name: 1 });

    if (!updatedBlog) {
      return response.status(404).json({ error: "blog not found" });
    }

    response.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error.message);
    response.status(400).json({ error: "malformatted id or bad request" });
  }
});

module.exports = router;
