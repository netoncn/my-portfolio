import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("deve renderizar input", () => {
    render(<Input placeholder="Enter text" />);

    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("deve aceitar valor", async () => {
    const user = userEvent.setup();

    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("deve chamar onChange quando o valor muda", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input placeholder="Enter text" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Enter text");
    await user.type(input, "Test");

    expect(handleChange).toHaveBeenCalled();
  });

  it("deve estar desabilitado quando disabled=true", () => {
    render(<Input disabled placeholder="Enter text" />);

    expect(screen.getByPlaceholderText("Enter text")).toBeDisabled();
  });

  it("deve aceitar type='password'", () => {
    render(<Input type="password" placeholder="Password" />);

    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("deve aceitar type='email'", () => {
    render(<Input type="email" placeholder="Email" />);

    const input = screen.getByPlaceholderText("Email");
    expect(input).toHaveAttribute("type", "email");
  });

  it("deve aplicar className customizada", () => {
    render(<Input className="custom-class" placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveClass("custom-class");
  });

  it("deve aceitar valor controlado", () => {
    const { rerender } = render(<Input value="Initial" readOnly />);

    expect(screen.getByDisplayValue("Initial")).toBeInTheDocument();

    rerender(<Input value="Updated" readOnly />);

    expect(screen.getByDisplayValue("Updated")).toBeInTheDocument();
  });

  it("deve aplicar atributo required", () => {
    render(<Input required placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeRequired();
  });
});
