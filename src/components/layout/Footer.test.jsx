import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );
}

describe("Footer", () => {
  it("renders the brand name", () => {
    renderFooter();
    expect(screen.getByText("Problem")).toBeInTheDocument();
    expect(screen.getByText("Mapper")).toBeInTheDocument();
  });

  it("renders all section headings", () => {
    renderFooter();
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
  });

  it("renders links with correct paths", () => {
    renderFooter();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", { name: "Report an Issue" }),
    ).toHaveAttribute("href", "/report-issue");
    expect(
      screen.getByRole("link", { name: "Track Complaint" }),
    ).toHaveAttribute("href", "/track-complaint");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("renders all four city names in the bottom bar", () => {
    renderFooter();
    expect(screen.getByText("Karachi")).toBeInTheDocument();
    expect(screen.getByText("Lahore")).toBeInTheDocument();
    expect(screen.getByText("Hyderabad")).toBeInTheDocument();
    expect(screen.getByText("Faisalabad")).toBeInTheDocument();
  });

  it("renders the current year in the copyright text", () => {
    renderFooter();
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
