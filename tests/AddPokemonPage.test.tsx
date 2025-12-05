import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import AddPokemonPage from "../src/pages/pokemons/AddPokemonPage";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("AddPokemonPage basic interactions", () => {
    it("renders form and allows submit when logged", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "2");

        // @ts-ignore
        global.fetch = vi.fn((url: string) => {
            if (url.endsWith('/pokemons')) {
                return Promise.resolve({ok: true, json: () => Promise.resolve({id: 123})});
            }
            return Promise.resolve({ok: true, json: () => Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/boxes/1"]}>
                <Routes>
                    <Route path="/boxes/:boxId" element={<AuthProvider><AddPokemonPage /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        // fill required fields
        fireEvent.change(screen.getByLabelText(/espèce/i), {target: {value: 'Pikachu'}});
        fireEvent.change(screen.getByLabelText(/niveau/i), {target: {value: '10'}});

        const btn = screen.getByRole('button', {name: /créer le pokémon/i});
        fireEvent.click(btn);

        await waitFor(() => expect(fetch).toHaveBeenCalled());
    });
});
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
