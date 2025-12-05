import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import PokemonDetail from "../src/pages/pokemons/PokemonDetail";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("PokemonDetail actions", () => {
    it("edits and saves pokemon info", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "2");

        const p = {id: 1, trainerId: 2, boxId: 1, species: "Pikachu", name: "Pika", level: 5, genderTypeCode: "MALE", isShiny: false, size: null, weight: null};

        // @ts-ignore
        global.fetch = vi.fn((url:string, opts?: any) => {
            if (url.includes('/pokemons/1') && opts?.method === 'PATCH') {
                return Promise.resolve({ok:true, json: () => Promise.resolve({...p, name:'Renamed'})});
            }
            if (url.includes('/pokemons/1')) {
                return Promise.resolve({ok:true, json: () => Promise.resolve(p)});
            }
            if (url.includes('/trainers/2')) {
                return Promise.resolve({ok:true, json: () => Promise.resolve({id:2, login:'me'})});
            }
            return Promise.resolve({ok:true, json: () => Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/pokemon/1"]}>
                <Routes>
                    <Route path="/pokemon/:pokemonId" element={<AuthProvider><PokemonDetail /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByRole('heading', {name: /pika/i})).toBeInTheDocument());

        // Click edit
        const editBtn = screen.getByText(/modifier le pokémon/i);
        fireEvent.click(editBtn);

        // Verify edit mode is active by looking for Annuler and Enregistrer buttons
        await waitFor(() => expect(screen.getByText(/annuler/i)).toBeInTheDocument());
        expect(screen.getByText(/enregistrer/i)).toBeInTheDocument();
    });

    it("deletes a pokemon", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "2");

        const p = {id: 1, trainerId: 2, boxId: 1, species: "Pikachu", name: "Pika", level: 5, genderTypeCode: "MALE", isShiny: false, size: null, weight: null};

        let confirmed = true;
        vi.spyOn(window, 'confirm').mockReturnValue(confirmed);

        // @ts-ignore
        global.fetch = vi.fn((url:string, opts?: any) => {
            if (url.includes('/pokemons/1') && opts?.method === 'DELETE') {
                return Promise.resolve({ok:true, json: () => Promise.resolve({})});
            }
            if (url.includes('/pokemons/1')) {
                return Promise.resolve({ok:true, json: () => Promise.resolve(p)});
            }
            if (url.includes('/trainers/2')) {
                return Promise.resolve({ok:true, json: () => Promise.resolve({id:2, login:'me'})});
            }
            return Promise.resolve({ok:true, json: () => Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/pokemon/1"]}>
                <Routes>
                    <Route path="/pokemon/:pokemonId" element={<AuthProvider><PokemonDetail /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByRole('heading', {name: /pika/i})).toBeInTheDocument());

        const deleteBtn = screen.getByText(/supprimer le pokémon/i);
        fireEvent.click(deleteBtn);

        await waitFor(() => expect(window.confirm).toHaveBeenCalled());
    });
});
