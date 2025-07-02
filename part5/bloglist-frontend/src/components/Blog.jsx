import { useState } from "react";

const Blog = ({ blogs, handleLike, user, handleRemove }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [displayBlog, setDisplayBlog] = useState(
    blogs && Object.fromEntries(sortedBlogs.map((blog) => [blog.id, false]))
  );

  const toggleSelectBlog = (blogId) => {
    setSelectedBlog(selectedBlog === blogId ? null : blogId);
  };

  const toggleDisplayBlog = (blogId) => {
    setDisplayBlog((prev) => ({
      ...prev,
      [blogId]: !prev[blogId],
    }));
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div>
      {sortedBlogs.map((blog, i) => {
        const sameUser = blog.user?.username === user.username;
        const blogId = blog.id;
        const isSelected = selectedBlog === blogId;

        // Estilos dinámicos
        const selectStyle = { borderColor: isSelected ? "red" : "black" };
        const combinedStyle = { ...blogStyle, ...selectStyle };
        const isVisible = {
          display: displayBlog[blogId] ? "" : "none",
        };

        return (
          <div
            data-testid="blogtitle"
            key={blog.id}
            style={combinedStyle}
            onClick={() => toggleSelectBlog(blogId)}
          >
            <leyend>title:</leyend> {blog.title}{" "}
            <button
              data-testid="closeview"
              onClick={() => {
                toggleDisplayBlog(blogId);
              }}
            >
              {displayBlog[blogId] ? "close" : "view"}
            </button>
            <div data-testid="blog-details" style={isVisible}>
              url: {blog.url}
              <br />
              likes: {blog.likes}{" "}
              <button data-testid="likebutton" onClick={() => handleLike(blog)}>
                Like
              </button>
              <br />
              author: {blog.author}
              <br />
              {sameUser && (
                <button
                  data-testid="removebutton"
                  onClick={() => handleRemove(blog.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Blog;
