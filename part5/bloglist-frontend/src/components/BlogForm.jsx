const BlogForm = ({ addBlog, newBlog, setNewBlog, user }) => {
  if (user === null) return null;

  return (
    <form onSubmit={addBlog}>
      <h2>Create new</h2>

      <label htmlFor="title">Title:</label>
      <input
        data-testid="title"
        placeholder="Title"
        id="title"
        type="text"
        value={newBlog.title}
        name="Title"
        onChange={({ target }) =>
          setNewBlog({ ...newBlog, title: target.value })
        }
      />
      <br />

      <label htmlFor="author">Author:</label>
      <input
        data-testid="author"
        placeholder="Author"
        id="author"
        type="text"
        value={newBlog.author}
        name="Author"
        onChange={({ target }) =>
          setNewBlog({ ...newBlog, author: target.value })
        }
      />
      <br />

      <label htmlFor="url">URL:</label>
      <input
        data-testid="url"
        placeholder="URL"
        id="url"
        type="text"
        value={newBlog.url}
        name="URL"
        onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
      />
      <br />

      <button data-testid="create" type="submit">
        create
      </button>
    </form>
  );
};

export default BlogForm;
