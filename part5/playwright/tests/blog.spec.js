// playwright/blog_app.spec.js
const { test, expect } = require("@playwright/test");

const baseUrl = "http://localhost:5173";
const apiBase = "http://localhost:3003/api";

const user = {
  name: "Shaka",
  username: "shakalawliet",
  password: "shaka",
};

const secondUser = {
  name: "Second",
  username: "seconduser",
  password: "password123",
};

async function loginFromUI(page, username, password) {
  await page.goto(baseUrl);
  await page.getByPlaceholder("username").fill(username);
  await page.getByPlaceholder("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
}

test.beforeEach(async ({ request, page }) => {
  await request.post(`${apiBase}/testing/reset`);
  await request.post(`${apiBase}/users`, { data: user });
  await request.post(`${apiBase}/users`, { data: secondUser });
  await loginFromUI(page, user.username, user.password);
});

test("displays the login form by default", async ({ page }) => {
  await page.getByRole("button", { name: "logout" }).click();
  await expect(page.getByText("log in to application")).toBeVisible();
});

test("fails with wrong credentials", async ({ page }) => {
  await page.getByRole("button", { name: "logout" }).click();
  await loginFromUI(page, user.username, "wrongpass");
  await expect(page.getByText("Wrong credentials")).toBeVisible();
  await expect(page.getByText("Shaka has logged in")).toHaveCount(0);
});

test("succeeds with correct credentials", async ({ page }) => {
  await expect(page.getByText("Shaka has logged in")).toBeVisible();
});

test("a logged in user can create a blog", async ({ page }) => {
  await locator.getByRole("button", { name: "Add Blog" }).click();
  await locator.getByTestId("#title").fill("shakablog1");
  await locator.getByTestId("#author").fill("Author");
  await locator.getByTestId("#url").fill("http://owner.com");
  await locator.getByTestId("button", { name: "create" }).click();

  await expect(page.getByText("shakablog1")).toBeVisible();
});

test("a blog can be liked", async ({ page }) => {
  // Crear blog primero
  await page.getByRole("button", { name: "Add Blog" }).click();
  await page.locator("#title").fill("Likable Blog");
  await page.locator("#author").fill("Author");
  await page.locator("#url").fill("http://like.com");
  await page.getByRole("button", { name: "create" }).click();

  const blog = page.locator("leyend", {
    hasText: "Likable Blog",
  });
  await blog.getByTestId("closeview").click();
  await blog.getByTestId("likebutton").click();
  await expect(blog.getByText("likes: 1")).toBeVisible();
});

test("user who added the blog can delete the blog", async ({ page }) => {
  await page.getByRole("button", { name: "Add Blog" }).click();
  await page.locator("#title").fill("DeleteBlog");
  await page.locator("#author").fill("Author");
  await page.locator("#url").fill("http://delete.com");
  await page.getByRole("button", { name: "create" }).click();

  const blog = page.locator('[data-testid="blogtitle"]', {
    hasText: "DeleteBlog",
  });
  await blog.getByTestId("closeview").click();

  page.once("dialog", (dialog) => dialog.accept());
  await blog.getByTestId("removebutton").click();

  await expect(blog).not.toBeVisible();
});

test("only the user who added the blog sees the delete button", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add Blog" }).click();
  await page.locator("#title").fill("OwnerOnlyBlog");
  await page.locator("#author").fill("Author");
  await page.locator("#url").fill("http://owner.com");
  await page.getByRole("button", { name: "create" }).click();

  await page.getByRole("button", { name: "logout" }).click();
  await loginFromUI(page, secondUser.username, secondUser.password);

  const blog = page.locator('[data-testid="blogtitle"]', {
    hasText: "OwnerOnlyBlog",
  });
  await blog.getByTestId("closeview").click();
  await expect(blog.getByTestId("removebutton")).toHaveCount(0);
});

test("blogs are arranged in order according to likes", async ({ page }) => {
  const blogs = [
    { title: "First", likes: 1 },
    { title: "Second", likes: 5 },
    { title: "Third", likes: 3 },
  ];

  for (const { title } of blogs) {
    await page.getByRole("button", { name: "Add Blog" }).click();
    await page.locator("#title").fill(title);
    await page.locator("#author").fill("Author");
    await page.locator("#url").fill(`http://${title}.com`);
    await page.getByRole("button", { name: "create" }).click();
  }

  const likeBlog = async (title, count) => {
    const blog = page.locator('[data-testid="blogtitle"]', { hasText: title });
    await blog.getByTestId("closeview").click();
    for (let i = 0; i < count; i++) {
      await blog.getByTestId("likebutton").click();
      await page.waitForTimeout(100);
    }
  };

  for (const { title, likes } of blogs) {
    await likeBlog(title, likes);
  }

  await page.reload();
  await loginFromUI(page, user.username, user.password);

  const titles = await page
    .locator('[data-testid="blogtitle"]')
    .allTextContents();
  expect(titles).toEqual(["Second", "Third", "First"]);
});
