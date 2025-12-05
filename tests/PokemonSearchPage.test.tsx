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
