import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
    );

    it("AuthProvider charge sans crasher", () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.logged).toBe(false);
    });

    it("login met bien à jour le contexte et le localStorage", () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login("TOKEN123", "42");
        });

        expect(result.current.logged).toBe(true);
        expect(result.current.token).toBe("TOKEN123");
        expect(result.current.trainerId).toBe("42");
        expect(localStorage.getItem("token")).toBe("TOKEN123");
        expect(localStorage.getItem("trainerId")).toBe("42");
    });

    it("logout vide bien le contexte et le localStorage", () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login("TOKEN123", "42");
        });

        act(() => {
            result.current.logout();
        });

        expect(result.current.logged).toBe(false);
        expect(result.current.token).toBeNull();
        expect(result.current.trainerId).toBeNull();
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("trainerId")).toBeNull();
    });
});
