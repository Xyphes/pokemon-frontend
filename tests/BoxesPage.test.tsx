import {describe, it, expect, beforeEach, vi} from "vitest";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import BoxesPage from "../src/pages/box/BoxesPage";
import React from "react";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("BoxesPage", () => {
    it("shows error when not logged", async () => {
        // ensure no token in localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("trainerId");

        render(
            <BrowserRouter>
                <AuthProvider>
                    <BoxesPage />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
        expect(screen.getByRole("alert")).toHaveTextContent(/vous devez être connecté/i);
    });

    it("renders list of boxes when fetch returns data", async () => {
        const fakeBoxes = [{id: 1, name: "Box 1"}];

        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "1");

        // @ts-ignore
        global.fetch = vi.fn(() => Promise.resolve({ok: true, json: () => Promise.resolve(fakeBoxes)}));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <BoxesPage />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.queryByText(/chargement/i)).not.toBeInTheDocument());

        expect(screen.getByText(/coffres d'hyrule/i)).toBeInTheDocument();
        expect(screen.getByText(/box 1/i)).toBeInTheDocument();
    });

    it("shows error when fetch fails", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "1");

        // @ts-ignore
        global.fetch = vi.fn(() => Promise.resolve({ok: false, status: 500}));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <BoxesPage />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
        expect(screen.getByRole("alert")).toHaveTextContent(/impossible de charger vos boîtes/i);
    });
});
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import BoxesPage from "../src/pages/box/BoxesPage";
import { AuthProvider } from "../src/context/AuthContext";

describe("BoxesPage", () => {
    beforeEach(() => {
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => [],
        } as any);
    });

    afterEach(() => {
        (global.fetch as any).mockRestore();
    });

    it("affiche un titre pour les coffres", () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <BoxesPage />
                </AuthProvider>
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /coffres d'hyrule/i })
        ).toBeInTheDocument();
    });
});
