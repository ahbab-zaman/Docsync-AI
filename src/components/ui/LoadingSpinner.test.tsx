// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders a status region with the default label", () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(<LoadingSpinner label="Saving document..." />);

    expect(screen.getByText("Saving document...")).toBeInTheDocument();
  });

  it("omits the label when it is empty", () => {
    render(<LoadingSpinner label="" />);

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("is polite to assistive technologies", () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});
