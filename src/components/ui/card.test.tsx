import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("deve renderizar card", () => {
    render(<Card data-testid="card">Card content</Card>);

    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("deve renderizar card com header, content e footer", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("deve aplicar className customizada no Card", () => {
    render(
      <Card className="custom-card" data-testid="card">
        Content
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveClass("custom-card");
  });

  it("deve aplicar className customizada no CardHeader", () => {
    render(
      <CardHeader className="custom-header" data-testid="header">
        Header
      </CardHeader>,
    );

    expect(screen.getByTestId("header")).toHaveClass("custom-header");
  });

  it("deve aplicar className customizada no CardContent", () => {
    render(
      <CardContent className="custom-content" data-testid="content">
        Content
      </CardContent>,
    );

    expect(screen.getByTestId("content")).toHaveClass("custom-content");
  });

  it("deve aplicar className customizada no CardFooter", () => {
    render(
      <CardFooter className="custom-footer" data-testid="footer">
        Footer
      </CardFooter>,
    );

    expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
  });

  it("deve renderizar CardTitle com className padrão", () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);

    const title = screen.getByTestId("title");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("DIV");
  });

  it("deve renderizar CardDescription com className padrão", () => {
    render(
      <CardDescription data-testid="description">Description</CardDescription>,
    );

    const description = screen.getByTestId("description");
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe("DIV");
  });
});
