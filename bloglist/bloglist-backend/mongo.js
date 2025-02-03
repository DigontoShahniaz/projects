const mongoose = require("mongoose");

const url =
  "mongodb+srv://fullstack:fullstack@fullstack.yvxwb.mongodb.net/test_blog_app?retryWrites=true&w=majority&appName=fullstack";
mongoose.set("strictQuery", false);
mongoose.connect(url).then(() => {
  console.log("connected to MongoDB");
});

mongoose.set("strictQuery", false);
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const blog = new Blog({
  title: "Hello WOrld",
  author: "Author One",
  url: "http://example.com/first",
  likes: 5,
});

blog.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});
