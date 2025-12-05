import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import TrainerSearchPage from "../src/pages/trainer/TrainerSearchPage";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("TrainerSearchPage basic", () => {
    it("shows message or results with fetch mock", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "6");

        const list = [{id:6, login:'u'}];
        // @ts-ignore
        global.fetch = vi.fn(() => Promise.resolve({ok:true, json:()=>Promise.resolve(list)}));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <TrainerSearchPage />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => expect(fetch).toHaveBeenCalled());
    });
});
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TrainerSearchPage from "../src/pages/trainer/TrainerSearchPage";

describe("TrainerSearchPage", () => {
    it("affiche un titre de recherche de dresseurs", () => {
        render(
            <BrowserRouter>
                <TrainerSearchPage />
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /rechercher des dresseur/i })
        ).toBeInTheDocument();
    });

    it("affiche un message demandant la connexion", () => {
        render(
            <BrowserRouter>
                <TrainerSearchPage />
            </BrowserRouter>
        );
        expect(
            screen.getByText(/vous devez être connecté/i)
        ).toBeInTheDocument();
    });
});
