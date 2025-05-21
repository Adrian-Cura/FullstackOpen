const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user");
    response.json(blogs);
  } catch (error) {
    response.status(500).json(error);
  }
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  try {
    const body = request.body;
    const user = request.user;

    const blog = new Blog({
      ...body,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
  try {
    const user = req.user;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }

    if (blog.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "only the creator can delete this blog" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

blogsRouter.put("/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes: req.body.likes },
      { new: true, runValidators: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ error: "blog not found" });
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = blogsRouter;
