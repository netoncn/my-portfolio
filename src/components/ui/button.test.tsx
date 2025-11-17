import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("deve renderizar o botão com texto", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("deve chamar onClick quando clicado", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("deve estar desabilitado quando disabled=true", () => {
    render(<Button disabled>Click me</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("não deve chamar onClick quando desabilitado", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>,
    );

    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("deve aplicar variante default por padrão", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");
  });

  it("deve aplicar variante destructive", () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("deve aplicar variante outline", () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
  });

  it("deve aplicar variante ghost", () => {
    render(<Button variant="ghost">Ghost</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-accent");
  });

  it("deve aplicar tamanho default por padrão", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-9");
  });

  it("deve aplicar tamanho sm", () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8");
  });

  it("deve aplicar tamanho lg", () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-10");
  });

  it("deve renderizar como child quando asChild=true", () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    );

    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("deve aplicar className customizada", () => {
    render(<Button className="custom-class">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("deve renderizar ícone dentro do botão", () => {
    render(
      <Button>
        <svg data-testid="icon" />
        With Icon
      </Button>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
