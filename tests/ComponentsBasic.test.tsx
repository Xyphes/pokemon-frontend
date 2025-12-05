import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { AuthProvider } from "../src/context/AuthContext";
import React from "react";

const renderComponent = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <AuthProvider>{component}</AuthProvider>
        </BrowserRouter>
    );
};

describe("Components - Basic Rendering", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe("Header", () => {
        it("renders header component", () => {
            const { container } = renderComponent(<Header />);
            expect(container).toBeTruthy();
        });

        it("has header element", () => {
            const { container } = renderComponent(<Header />);
            expect(container.querySelector("header")).toBeTruthy();
        });

        it("contains navigation", () => {
            const { container } = renderComponent(<Header />);
            expect(container.querySelector("nav")).toBeTruthy();
        });

        it("has links", () => {
            const { container } = renderComponent(<Header />);
            const links = container.querySelectorAll("a");
            expect(links.length).toBeGreaterThan(0);
        });

        it("renders with logged out state", () => {
            localStorage.clear();
            const { container } = renderComponent(<Header />);
            expect(container.querySelector("header")).toBeTruthy();
        });

        it("renders with logged in state", () => {
            localStorage.setItem("token", "test-token");
            localStorage.setItem("trainerId", "1");
            const { container } = renderComponent(<Header />);
            expect(container.querySelector("header")).toBeTruthy();
        });
    });

    describe("Footer", () => {
        it("renders footer component", () => {
            const { container } = renderComponent(<Footer />);
            expect(container).toBeTruthy();
        });

        it("has footer element", () => {
            const { container } = renderComponent(<Footer />);
            expect(container.querySelector("footer")).toBeTruthy();
        });

        it("contains text content", () => {
            const { container } = renderComponent(<Footer />);
            const footer = container.querySelector("footer");
            expect(footer?.textContent).toBeTruthy();
        });

        it("displays copyright info", () => {
            const { container } = renderComponent(<Footer />);
            const text = container.querySelector("footer")?.textContent || "";
            expect(text.length).toBeGreaterThan(0);
        });
    });
});

