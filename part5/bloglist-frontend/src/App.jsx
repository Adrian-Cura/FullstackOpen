import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationMessage, setNotificationmessage] = useState("");
  const [user, setUser] = useState(null);
  const [refreshBlogs, setRefreshBlogs] = useState(false);
  const blogFormRef = useRef();
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotificationmessage("Wrong credentials");
      setTimeout(() => {
        setNotificationmessage(null);
      }, 5000);
    }
  };
  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedUser");
    blogService.setToken(null);
    setUser(null);
  };
  const addBlog = async (event) => {
    event.preventDefault();
    console.log(user);
    console.log("submitting blog");
    try {
      const blog = await blogService.create(newBlog);
      setRefreshBlogs(!refreshBlogs);
      setNotificationmessage(`
        A new blog: ${blog.title} by ${blog.author} added!`);
    } catch (error) {
      console.log(error);
      setNotificationmessage("Can't add a blog right now");
    }
    blogFormRef.current.toggleVisibility();
    setNewBlog({ title: "", author: "", url: "" });
    setTimeout(() => {
      setNotificationmessage("");
    }, 5000);
  };
  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    blog.likes = blog.likes + 1;
    try {
      await blogService.update(blog.id, updatedBlog);
    } catch (err) {
      console.log(err);
    }
  };
  const handleRemove = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;
    try {
      await blogService.remove(id);
    } catch (error) {
      console.log(error);
    }
    setRefreshBlogs(!refreshBlogs);
  };
  useEffect(() => {
    if (user === null) {
      return;
    }
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, [user, refreshBlogs]);
  const blogForm = () => (
    <Togglable buttonLabel={"Add Blog"} ref={blogFormRef}>
      <BlogForm
        addBlog={addBlog}
        newBlog={newBlog}
        setNewBlog={setNewBlog}
        user={user}
      />
    </Togglable>
  );
  return (
    <div>
      <LoginForm
        handleLogin={handleLogin}
        user={user}
        setUsername={setUsername}
        setPassword={setPassword}
        username={username}
        password={password}
      />{" "}
      <h2>{notificationMessage && notificationMessage}</h2>
      {user === null ? (
        ""
      ) : (
        <div>
          <h2>Blog</h2>
          <p>
            {`${user.name} has logged in`}{" "}
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          <Blog
            blogs={blogs}
            handleLike={handleLike}
            user={user}
            handleRemove={handleRemove}
          />
        </div>
      )}
    </div>
  );
};
export default App;
