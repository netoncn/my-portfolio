import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("deve renderizar badge com texto", () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("deve aplicar variante default por padrão", () => {
    render(<Badge>Default</Badge>);

    const badge = screen.getByText("Default");
    expect(badge).toHaveClass("bg-primary");
  });

  it("deve aplicar variante secondary", () => {
    render(<Badge variant="secondary">Secondary</Badge>);

    const badge = screen.getByText("Secondary");
    expect(badge).toHaveClass("bg-secondary");
  });

  it("deve aplicar variante destructive", () => {
    render(<Badge variant="destructive">Destructive</Badge>);

    const badge = screen.getByText("Destructive");
    expect(badge).toHaveClass("bg-destructive");
  });

  it("deve aplicar variante outline", () => {
    render(<Badge variant="outline">Outline</Badge>);

    const badge = screen.getByText("Outline");
    expect(badge).toHaveClass("text-foreground");
  });

  it("deve aplicar className customizada", () => {
    render(<Badge className="custom-class">Custom</Badge>);

    const badge = screen.getByText("Custom");
    expect(badge).toHaveClass("custom-class");
  });

  it("deve renderizar como elemento HTML customizado", () => {
    render(
      <Badge>
        <span data-testid="content">Content</span>
      </Badge>,
    );

    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
});
