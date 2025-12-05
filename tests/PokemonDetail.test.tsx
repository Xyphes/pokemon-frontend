import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import PokemonDetail from "../src/pages/pokemons/PokemonDetail";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("PokemonDetail basic render", () => {
    it("renders pokemon info when fetch returns data", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "2");

        const p = {id: 1, species: "Pikachu", name: "Pika", level: 5, genderTypeCode: "MALE", isShiny: false};
        // @ts-ignore
        global.fetch = vi.fn((url: string) => {
            if (url.includes('/pokemons/1')) return Promise.resolve({ok: true, json: () => Promise.resolve(p)});
            if (url.includes('/trainers')) return Promise.resolve({ok: true, json: () => Promise.resolve({id:2, login:'me'})});
            return Promise.resolve({ok: true, json: () => Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/pokemon/1"]}>
                <Routes>
                    <Route path="/pokemon/:pokemonId" element={<AuthProvider><PokemonDetail /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByRole('heading', { name: /pikachu/i })).toBeInTheDocument());
    });
});
