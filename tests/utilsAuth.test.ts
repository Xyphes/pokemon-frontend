import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import React from "react";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("utils/auth", () => {
    it("initializes logged from localStorage", () => {
        localStorage.setItem("token", "TOK");
        localStorage.setItem("trainerId", "1");
        const wrapper = ({ children }: { children: React.ReactNode }) => React.createElement(AuthProvider, { children });
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.logged).toBe(true);
    });

    it("login sets token and logged", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => React.createElement(AuthProvider, { children });
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login("NEW_TOKEN", "123");
        });

        expect(result.current.logged).toBe(true);
        expect(localStorage.getItem("token")).toBe("NEW_TOKEN");
    });

    it("logout clears token and logged", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => React.createElement(AuthProvider, { children });
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login("TOK", "1");
        });

        act(() => {
            result.current.logout();
        });

        expect(result.current.logged).toBe(false);
        expect(localStorage.getItem("token")).toBeNull();
    });
});
