import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const blogs = [
  {
    id: "123",
    title: "Testing React Components",
    author: "Jane Developer",
    url: "http://example.com/blog",
    likes: 7,
    user: {
      username: "janedoe",
    },
  },
];

const mockHandleLike = vi.fn();
const mockHandleRemove = vi.fn();
const mockUser = { username: "janedoe" };

describe("Blog component", () => {
  it("renders title and author, but not url or likes by default", () => {
    render(
      <Blog
        blogs={blogs}
        handleLike={mockHandleLike}
        handleRemove={mockHandleRemove}
        user={mockUser}
      />
    );

    expect(screen.getByTestId("blogtitle")).toHaveTextContent(
      "Testing React Components"
    );
    expect(screen.getByTestId("blogtitle")).toHaveTextContent("Jane Developer");
    expect(
      screen.queryByText("http://example.com/blog")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("7")).not.toBeInTheDocument();
  });

  it("shows URL and number of likes when the view button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Blog
        blogs={blogs}
        handleLike={mockHandleLike}
        handleRemove={mockHandleRemove}
        user={mockUser}
      />
    );

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const details = screen.getByTestId("blog-details");
    expect(details).toHaveTextContent("http://example.com/blog");
    expect(details).toHaveTextContent("7");
  });

  it("calls the like handler twice when the like button is clicked twice", async () => {
    const user = userEvent.setup();

    render(
      <Blog
        blogs={blogs}
        handleLike={mockHandleLike}
        handleRemove={mockHandleRemove}
        user={mockUser}
      />
    );

    // Mostrar detalles primero (para que aparezca el botón Like)
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    // Ahora debería aparecer el botón "Like"
    const likeButton = screen.getByText("Like");

    // Hacer dos clicks
    await user.click(likeButton);
    await user.click(likeButton);

    // Verificar que se llamó dos veces
    expect(mockHandleLike).toHaveBeenCalledTimes(2);
  });
});
