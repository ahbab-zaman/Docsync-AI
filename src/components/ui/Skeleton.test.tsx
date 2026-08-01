// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Skeleton from "@/components/ui/Skeleton";

describe("Skeleton", () => {
  it("renders a decorative placeholder hidden from screen readers", () => {
    const { container } = render(<Skeleton className="h-4 w-full" />);

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute("aria-hidden", "true");
    expect(element.className).toContain("animate-pulse");
  });

  it("appends custom classes", () => {
    const { container } = render(<Skeleton className="h-10 w-40" />);

    const element = container.firstChild as HTMLElement;
    expect(element.className).toContain("h-10");
    expect(element.className).toContain("w-40");
  });
});
