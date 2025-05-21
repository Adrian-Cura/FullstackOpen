const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max));
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const blogCount = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    return counts;
  }, {});

  const topAuthor = Object.keys(blogCount).reduce((max, author) =>
    blogCount[author] > blogCount[max] ? author : max
  );

  return {
    author: topAuthor,
    blogs: blogCount[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesCount = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes;
    return counts;
  }, {});

  const topAuthor = Object.keys(likesCount).reduce((max, author) =>
    likesCount[author] > likesCount[max] ? author : max
  );

  return {
    author: topAuthor,
    likes: likesCount[topAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
