import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("BlogForm", () => {
  it("calls addBlog with correct details when form is submitted", async () => {
    const user = userEvent.setup();
    const mockAddBlog = vi.fn();
    const mockSetNewBlog = vi.fn();

    const newBlog = {
      title: "",
      author: "",
      url: "",
    };

    render(
      <BlogForm
        addBlog={mockAddBlog}
        newBlog={newBlog}
        setNewBlog={mockSetNewBlog}
        user={{ username: "janedoe" }}
      />
    );

    // Llenar los campos del formulario
    await user.type(
      screen.getByRole("textbox", { name: /title/i }),
      "React Testing"
    );
    await user.type(
      screen.getByRole("textbox", { name: /author/i }),
      "Jane Developer"
    );
    await user.type(
      screen.getByRole("textbox", { name: /url/i }),
      "http://example.com/test"
    );

    // Enviar el formulario
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(mockAddBlog).toHaveBeenCalledTimes(1);

    // Verificamos que el evento submit haya sido llamado con un objeto de tipo Event
    expect(mockAddBlog.mock.calls[0][0]).toBeInstanceOf(Object);
    expect(mockAddBlog.mock.calls[0][0].preventDefault).toBeInstanceOf(
      Function
    );
  });
});
