﻿import {describe, it, expect, beforeEach, vi} from "vitest";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import PokemonSearchPage from "../src/pages/pokemons/PokemonSearchPage";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("PokemonSearchPage", () => {
    it("shows alert when not logged", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("trainerId");

        render(
            <BrowserRouter>
                <AuthProvider>
                    <PokemonSearchPage />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(/vous devez être connecté/i);
    });

    it("renders results when fetch returns pokemons", async () => {
        const sample = [
            {id: 1, trainerId: 2, species: "Pikachu", name: "Pika", level: 10, genderTypeCode: "MALE", isShiny: false},
        ];

        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "2");

        // @ts-ignore
        global.fetch = vi.fn(() => Promise.resolve({ok: true, json: () => Promise.resolve(sample)}));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <PokemonSearchPage />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.queryByText(/chargement/i)).not.toBeInTheDocument());

        expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
        const pikaElements = screen.queryAllByText(/pika/i);
        expect(pikaElements.length).toBeGreaterThan(0);
    });
});
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PokemonSearchPage from "../src/pages/pokemons/PokemonSearchPage";

describe("PokemonSearchPage", () => {
    it("affiche un titre de recherche de pokémons", () => {
        render(
            <BrowserRouter>
                <PokemonSearchPage />
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /rechercher des pokémons/i })
        ).toBeInTheDocument();
    });

    it("affiche un message demandant la connexion", () => {
        render(
            <BrowserRouter>
                <PokemonSearchPage />
            </BrowserRouter>
        );
        expect(
            screen.getByText(/vous devez être connecté/i)
        ).toBeInTheDocument();
    });
});
