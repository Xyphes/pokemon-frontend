// tests/AddPokemonPage.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddPokemonPage from "../src/pages/pokemons/AddPokemonPage";

describe("AddPokemonPage", () => {
    it("affiche le titre Nouveau Pokémon", () => {
        render(
            <BrowserRouter>
                <AddPokemonPage />
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /nouveau pokémon/i })
        ).toBeInTheDocument();
    });
});
