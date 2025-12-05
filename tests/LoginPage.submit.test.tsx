import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage";
import { AuthProvider } from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
});

describe("LoginPage submit", () => {
    it("renders login form", () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/adresse email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    });

    it("accepts user input", () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/adresse email/i) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(/mot de passe/i) as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: "user@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password" } });

        expect(emailInput.value).toBe("user@example.com");
        expect(passwordInput.value).toBe("password");
    });

    it("submits form with credentials", async () => {
        (global.fetch as any) = vi.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () =>
                    Promise.resolve({ accessToken: "token", trainerId: "1" }),
            })
        );

        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/adresse email/i), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), {
            target: { value: "password" },
        });

        fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });

    it("handles failed login", async () => {
        (global.fetch as any) = vi.fn(() =>
            Promise.resolve({
                ok: false,
                status: 401,
                json: () => Promise.resolve({}),
            })
        );

        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/adresse email/i), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), {
            target: { value: "password" },
        });

        fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });

    it("handles network errors", async () => {
        (global.fetch as any) = vi.fn(() =>
            Promise.reject(new Error("Network error"))
        );

        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/adresse email/i), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), {
            target: { value: "password" },
        });

        fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });
});
