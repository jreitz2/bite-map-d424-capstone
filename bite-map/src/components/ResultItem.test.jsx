import { render, screen, fireEvent } from "@testing-library/react";
import ResultItem from "./ResultItem";
import { vi } from "vitest";
import supabaseClient from "../supabase";

// Mock supabaseClient
vi.mock("../supabase", async () => {
  const actual = await vi.importActual("../supabase");
  return {
    ...actual,
    default: {
      ...actual.default,
      auth: {
        getUser: vi.fn(),
      },
    },
  };
});

describe("ResultItem Component", () => {
  const mockReview = {
    id: 1,
    user_id: "user-123",
    user_name: "Test User",
    rating: 4,
    description: "Great place!",
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    supabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
  });

  it("renders the review details correctly", async () => {
    render(<ResultItem review={mockReview} setSelectedPlace={() => {}} />);
    expect(await screen.findByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Rating: 4")).toBeInTheDocument();
    expect(screen.getByText("Great place!")).toBeInTheDocument();
  });

  it("shows edit and delete buttons for the review owner", async () => {
    render(<ResultItem review={mockReview} setSelectedPlace={() => {}} />);
    expect(await screen.findByText("X")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("toggles edit mode when the edit button is clicked", async () => {
    render(<ResultItem review={mockReview} setSelectedPlace={() => {}} />);
    const editButton = await screen.findByText("Edit");
    fireEvent.click(editButton);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });
});
