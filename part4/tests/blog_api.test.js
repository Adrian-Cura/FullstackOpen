const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");

const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

let token;

const initialBlogs = [
  {
    title: "Test Blog 1",
    author: "Author 1",
    url: "http://example.com/1",
    likes: 5,
  },
  {
    title: "Test Blog 2",
    author: "Author 2",
    url: "http://example.com/2",
    likes: 10,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Temporary Blog",
    author: "Temp Author",
    url: "http://example.com/temp",
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("testpassword", 10);
  const user = new User({
    username: "testuser",
    name: "Test User",
    passwordHash,
  });
  await user.save();

  const loginResponse = await api
    .post("/api/login")
    .send({ username: "testuser", password: "testpassword" });

  token = loginResponse.body.token;

  const blogObjects = initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id })
  );
  await Blog.insertMany(blogObjects);
});

describe("when there are some blogs saved initially", () => {
  describe("fetching all blogs", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("all blogs are returned", async () => {
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test("blogs have id property", async () => {
      const response = await api.get("/api/blogs");
      response.body.forEach((blog) => {
        assert.ok(blog.id, "blog should have an id property");
        assert.strictEqual(
          blog._id,
          undefined,
          "blog should not have an _id property"
        );
      });
    });
  });

  describe("adding a new blog", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "New Test Blog",
        author: "Author 3",
        url: "http://example.com/3",
        likes: 7,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert.ok(titles.includes(newBlog.title));
    });

    test("blog without likes defaults to 0", async () => {
      const newBlog = {
        title: "Blog Without Likes",
        author: "Author 4",
        url: "http://example.com/4",
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test("blog without title returns 400", async () => {
      const newBlog = {
        author: "Author 5",
        url: "http://example.com/5",
        likes: 3,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test("blog without url returns 400", async () => {
      const newBlog = {
        title: "Blog Without URL",
        author: "Author 6",
        likes: 4,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test("adding a blog fails with 401 if token is not provided", async () => {
      const newBlog = {
        title: "Unauthorized Blog",
        author: "No Auth",
        url: "http://noauth.com",
        likes: 0,
      };

      await api.post("/api/blogs").send(newBlog).expect(401);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid and token provided", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(!titles.includes(blogToDelete.title));
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const validNonexistingId = await nonExistingId();

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });

    test("fails with status code 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  describe("updating a blog", () => {
    test("succeeds with valid id and data", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedData = {
        likes: blogToUpdate.likes + 10,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, updatedData.likes);
      assert.strictEqual(response.body.title, blogToUpdate.title);
      assert.strictEqual(response.body.author, blogToUpdate.author);
      assert.strictEqual(response.body.url, blogToUpdate.url);
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const validNonexistingId = await nonExistingId();

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send({ likes: 5 })
        .expect(404);
    });

    test("fails with status code 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.put(`/api/blogs/${invalidId}`).send({ likes: 5 }).expect(400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
