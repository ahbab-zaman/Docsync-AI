// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CollaboratorAvatars, { type Collaborator } from "@/components/presence/CollaboratorAvatars";

const collaborators: Collaborator[] = [
  { id: "1", name: "Ada Lovelace", avatar_url: null, color: "#5b4bff", isOnline: true },
  { id: "2", name: "Grace Hopper", avatar_url: null, color: "#0fa3b1", isOnline: false },
];

describe("CollaboratorAvatars", () => {
  it("renders initials for each collaborator", () => {
    render(<CollaboratorAvatars collaborators={collaborators} />);

    expect(screen.getByTitle("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByTitle("Grace Hopper")).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByText("GH")).toBeInTheDocument();
  });

  it("shows an online indicator only for online collaborators", () => {
    const { container } = render(<CollaboratorAvatars collaborators={collaborators} />);

    expect(container.querySelectorAll(".bg-success").length).toBe(1);
  });

  it("caps visible avatars and renders the overflow count", () => {
    const many = Array.from({ length: 7 }, (_, i) => ({
      id: String(i),
      name: `User ${i}`,
      avatar_url: null,
      color: "#000000",
      isOnline: false,
    }));

    render(<CollaboratorAvatars collaborators={many} max={5} />);

    const overflow = screen.getByTitle("2 more");
    expect(overflow.textContent).toContain("+2");
    expect(screen.queryByTitle("User 6")).not.toBeInTheDocument();
  });

  it("renders no overflow for exactly the max number of collaborators", () => {
    render(<CollaboratorAvatars collaborators={collaborators} max={2} />);

    expect(screen.queryByTitle("+0")).not.toBeInTheDocument();
  });
});
