const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const listWithMultipleBlogs = [
    {
      title: "Blog 1",
      author: "Author 1",
      url: "http://example.com/1",
      likes: 2,
    },
    {
      title: "Blog 2",
      author: "Author 2",
      url: "http://example.com/2",
      likes: 3,
    },
    {
      title: "Blog 3",
      author: "Author 3",
      url: "http://example.com/3",
      likes: 4,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has multiple blogs, equals the sum of likes", () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    assert.strictEqual(result, 9); // 2 + 3 + 4
  });

  test("when list is empty, equals zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });
});

describe("favorite blog", () => {
  const blogs = [
    {
      title: "Blog 1",
      author: "Author 1",
      url: "http://example.com/1",
      likes: 2,
    },
    {
      title: "Blog 2",
      author: "Author 2",
      url: "http://example.com/2",
      likes: 5,
    },
    {
      title: "Blog 3",
      author: "Author 3",
      url: "http://example.com/3",
      likes: 3,
    },
  ];

  test("returns the blog with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: "Blog 2",
      author: "Author 2",
      url: "http://example.com/2",
      likes: 5,
    });
  });

  test("when list is empty, returns null", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });

  test("when list has one blog, returns that blog", () => {
    const singleBlog = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://example.com/1",
        likes: 2,
      },
    ];
    const result = listHelper.favoriteBlog(singleBlog);
    assert.deepStrictEqual(result, singleBlog[0]);
  });
});

describe("most blogs", () => {
  const blogs = [
    {
      title: "Blog 1",
      author: "Author 1",
      url: "http://example.com/1",
      likes: 2,
    },
    {
      title: "Blog 2",
      author: "Author 2",
      url: "http://example.com/2",
      likes: 5,
    },
    {
      title: "Blog 3",
      author: "Author 1",
      url: "http://example.com/3",
      likes: 3,
    },
    {
      title: "Blog 4",
      author: "Author 2",
      url: "http://example.com/4",
      likes: 1,
    },
    {
      title: "Blog 5",
      author: "Author 1",
      url: "http://example.com/5",
      likes: 4,
    },
  ];

  test("returns the author with most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: "Author 1",
      blogs: 3,
    });
  });

  test("when list is empty, returns null", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });

  test("when list has one blog, returns that author with one blog", () => {
    const singleBlog = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://example.com/1",
        likes: 2,
      },
    ];
    const result = listHelper.mostBlogs(singleBlog);
    assert.deepStrictEqual(result, {
      author: "Author 1",
      blogs: 1,
    });
  });
});

describe("most likes", () => {
  const blogs = [
    {
      title: "Blog 1",
      author: "Author 1",
      url: "http://example.com/1",
      likes: 2,
    },
    {
      title: "Blog 2",
      author: "Author 2",
      url: "http://example.com/2",
      likes: 5,
    },
    {
      title: "Blog 3",
      author: "Author 1",
      url: "http://example.com/3",
      likes: 3,
    },
    {
      title: "Blog 4",
      author: "Author 2",
      url: "http://example.com/4",
      likes: 1,
    },
    {
      title: "Blog 5",
      author: "Author 1",
      url: "http://example.com/5",
      likes: 4,
    },
  ];

  test("returns the author with most likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Author 1",
      likes: 9, // 2 + 3 + 4
    });
  });

  test("when list is empty, returns null", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });

  test("when list has one blog, returns that author with their likes", () => {
    const singleBlog = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://example.com/1",
        likes: 2,
      },
    ];
    const result = listHelper.mostLikes(singleBlog);
    assert.deepStrictEqual(result, {
      author: "Author 1",
      likes: 2,
    });
  });
});
