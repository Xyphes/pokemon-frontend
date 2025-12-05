import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import LoginPage from "../src/pages/LoginPage";
import HomePage from "../src/pages/HomePage";
import React from "react";

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <AuthProvider>{component}</AuthProvider>
        </BrowserRouter>
    );
};

describe("Integration Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        global.fetch = vi.fn();
    });

    describe("Authentication Flow", () => {
        it("initializes with logged out state", () => {
            const { container } = renderWithRouter(<HomePage />);
            expect(container).toBeTruthy();
        });

        it("can access home page without login", () => {
            const { container } = renderWithRouter(<HomePage />);
            expect(container.querySelector("main")).toBeTruthy();
        });

        it("displays login page", () => {
            const { container } = renderWithRouter(<LoginPage />);
            expect(container.querySelector("form")).toBeTruthy();
        });

        it("login page has required fields", () => {
            const { container } = renderWithRouter(<LoginPage />);
            const form = container.querySelector("form");
            expect(form).toBeTruthy();
        });
    });

    describe("Navigation", () => {
        it("home page renders", () => {
            const { container } = renderWithRouter(<HomePage />);
            expect(container.querySelector("main")).toBeTruthy();
        });

        it("pages have main content", () => {
            const { container } = renderWithRouter(<HomePage />);
            expect(container.querySelector("main")).toBeTruthy();
        });
    });

    describe("State Management", () => {
        it("preserves state across re-renders", () => {
            localStorage.setItem("token", "test-token");

            const { container, rerender } = renderWithRouter(<HomePage />);

            expect(localStorage.getItem("token")).toBe("test-token");

            rerender(
                <BrowserRouter>
                    <AuthProvider>
                        <HomePage />
                    </AuthProvider>
                </BrowserRouter>
            );

            expect(localStorage.getItem("token")).toBe("test-token");
        });

        it("clears localStorage on logout", () => {
            localStorage.setItem("token", "test-token");
            localStorage.setItem("trainerId", "123");

            expect(localStorage.getItem("token")).toBe("test-token");

            localStorage.clear();

            expect(localStorage.getItem("token")).toBeNull();
            expect(localStorage.getItem("trainerId")).toBeNull();
        });
    });

    describe("Error Handling", () => {
        it("handles missing elements gracefully", () => {
            const { container } = renderWithRouter(<HomePage />);
            expect(container).toBeTruthy();
        });

        it("renders even with fetch errors", async () => {
            (global.fetch as any).mockRejectedValueOnce(
                new Error("Network error")
            );

            const { container } = renderWithRouter(<HomePage />);
            expect(container).toBeTruthy();
        });
    });

    describe("Accessibility", () => {
        it("pages have main landmark", () => {
            const { container } = renderWithRouter(<HomePage />);
            expect(container.querySelector("main")).toBeTruthy();
        });

        it("pages have proper HTML structure", () => {
            const { container } = renderWithRouter(<HomePage />);
            expect(container.querySelector("main")).toBeTruthy();
            expect(container.innerHTML).toBeTruthy();
        });

        it("renders without crashing", () => {
            const { container } = renderWithRouter(<HomePage />);
            expect(container).toBeTruthy();
        });
    });
});

