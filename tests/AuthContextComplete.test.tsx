import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import React from "react";

describe("AuthContext - Complete Coverage", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it("initializes with values from localStorage", () => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("trainerId", "123");

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.token).toBe("test-token");
        expect(result.current.trainerId).toBe("123");
        expect(result.current.logged).toBe(true);
    });

    it("initializes with null when no localStorage data", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.token).toBeNull();
        expect(result.current.trainerId).toBeNull();
        expect(result.current.logged).toBe(false);
    });

    it("login updates state and localStorage", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login("new-token", "456");
        });

        expect(result.current.token).toBe("new-token");
        expect(result.current.trainerId).toBe("456");
        expect(result.current.logged).toBe(true);
        expect(localStorage.getItem("token")).toBe("new-token");
        expect(localStorage.getItem("trainerId")).toBe("456");
    });

    it("logout clears state and localStorage", () => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("trainerId", "123");

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.logged).toBe(true);

        act(() => {
            result.current.logout();
        });

        expect(result.current.token).toBeNull();
        expect(result.current.trainerId).toBeNull();
        expect(result.current.logged).toBe(false);
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("trainerId")).toBeNull();
    });

    it("handles multiple login/logout cycles", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        // First cycle
        act(() => {
            result.current.login("token1", "id1");
        });
        expect(result.current.logged).toBe(true);

        act(() => {
            result.current.logout();
        });
        expect(result.current.logged).toBe(false);

        // Second cycle
        act(() => {
            result.current.login("token2", "id2");
        });
        expect(result.current.token).toBe("token2");
        expect(result.current.trainerId).toBe("id2");
    });

    it("logged is true only when token exists", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.logged).toBe(false);

        act(() => {
            result.current.login("token", "id");
        });

        expect(result.current.logged).toBe(true);

        act(() => {
            result.current.logout();
        });

        expect(result.current.logged).toBe(false);
    });
});

