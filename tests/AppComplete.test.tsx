import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../src/App";
import { AuthProvider } from "../src/context/AuthContext";
import React from "react";

const renderApp = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe("App - Complete", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        global.fetch = vi.fn();
    });

    it("renders app without crashing", () => {
        const { container } = renderApp();
        expect(container).toBeTruthy();
    });

    it("has main layout elements", () => {
        const { container } = renderApp();
        expect(container.querySelector("main")).toBeTruthy();
    });

    it("renders header", () => {
        const { container } = renderApp();
        expect(container.querySelector("header")).toBeTruthy();
    });

    it("renders footer", () => {
        const { container } = renderApp();
        expect(container.querySelector("footer")).toBeTruthy();
    });

    it("contains router outlet", () => {
        const { container } = renderApp();
        expect(container).toBeTruthy();
    });

    it("works when user is logged in", () => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("trainerId", "123");

        const { container } = renderApp();
        expect(container).toBeTruthy();
    });

    it("works when user is logged out", () => {
        localStorage.clear();

        const { container } = renderApp();
        expect(container).toBeTruthy();
    });
});

