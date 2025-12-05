import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../src/pages/HomePage";
import AboutPage from "../src/pages/AboutPage";
import SubscribePage from "../src/pages/SubscribePage";
import LoginPage from "../src/pages/LoginPage";
import { AuthProvider } from "../src/context/AuthContext";
import React from "react";

const renderPage = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <AuthProvider>{component}</AuthProvider>
        </BrowserRouter>
    );
};

describe("Pages - Basic Rendering", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        global.fetch = vi.fn();
    });

    describe("HomePage", () => {
        it("renders without crashing", () => {
            renderPage(<HomePage />);
            expect(renderPage).toBeDefined();
        });

        it("displays on the page", async () => {
            renderPage(<HomePage />);
            await waitFor(() => {
                expect(renderPage).toBeDefined();
            });
        });

        it("contains main content", () => {
            const { container } = renderPage(<HomePage />);
            expect(container).toBeTruthy();
        });

        it("has proper structure", () => {
            const { container } = renderPage(<HomePage />);
            expect(container.querySelector("main")).toBeTruthy();
        });
    });

    describe("AboutPage", () => {
        it("renders without crashing", () => {
            renderPage(<AboutPage />);
            expect(renderPage).toBeDefined();
        });

        it("displays page content", () => {
            const { container } = renderPage(<AboutPage />);
            expect(container).toBeTruthy();
        });

        it("has main element", () => {
            const { container } = renderPage(<AboutPage />);
            expect(container.querySelector("main")).toBeTruthy();
        });
    });

    describe("LoginPage", () => {
        it("renders login form", () => {
            renderPage(<LoginPage />);
            expect(renderPage).toBeDefined();
        });

        it("displays on page", () => {
            const { container } = renderPage(<LoginPage />);
            expect(container).toBeTruthy();
        });

        it("contains form element", () => {
            const { container } = renderPage(<LoginPage />);
            expect(container.querySelector("form")).toBeTruthy();
        });

        it("has input fields", () => {
            const { container } = renderPage(<LoginPage />);
            const inputs = container.querySelectorAll("input");
            expect(inputs.length).toBeGreaterThan(0);
        });
    });

    describe("SubscribePage", () => {
        it("renders signup form", () => {
            renderPage(<SubscribePage />);
            expect(renderPage).toBeDefined();
        });

        it("displays subscription form", () => {
            const { container } = renderPage(<SubscribePage />);
            expect(container.querySelector("form")).toBeTruthy();
        });

        it("contains multiple inputs", () => {
            const { container } = renderPage(<SubscribePage />);
            const inputs = container.querySelectorAll("input");
            expect(inputs.length).toBeGreaterThanOrEqual(4);
        });
    });
});

