// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "@/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(<EmptyState title="No projects" description="Create one to begin." />);

    expect(screen.getByText("No projects")).toBeInTheDocument();
    expect(screen.getByText("Create one to begin.")).toBeInTheDocument();
  });

  it("renders a string icon as decorative text", () => {
    render(<EmptyState icon="📄" title="No projects" />);

    const icon = screen.getByText("📄");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("wraps a ReactElement icon with aria-hidden", () => {
    render(<EmptyState icon={<svg data-testid="icon" />} title="No projects" />);

    const wrapper = screen.getByTestId("icon").parentElement as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });

  it("renders an action element", () => {
    render(<EmptyState title="No projects" action={<button>Create project</button>} />);

    expect(screen.getByRole("button", { name: "Create project" })).toBeInTheDocument();
  });
});
