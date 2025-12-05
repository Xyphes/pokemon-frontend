import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import {MemoryRouter, Routes, Route} from "react-router-dom";

import BoxDetailPage from "../src/pages/box/BoxDetailPage";
import PokemonDetail from "../src/pages/pokemons/PokemonDetail";
import PokemonSearchPage from "../src/pages/pokemons/PokemonSearchPage";
import TradesListPage from "../src/pages/trades/TradesListPage";
import TradeDetailPage from "../src/pages/trades/TradeDetailPage";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("Coverage smoke tests", () => {
    it("renders BoxDetail and enters move mode", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "10");

        // Mock fetch responses based on URL
        // @ts-ignore
        global.fetch = vi.fn((url: string, opts?: any) => {
            if (url.includes('/trainers/10/boxes/1')) {
                return Promise.resolve({ok: true, json: () => Promise.resolve({id:1, name:'Smoke Box', pokemons:[{id:11, species:'Pikachu', name:'P1', level:5, genderTypeCode:'MALE', isShiny:false}]})});
            }
            if (url.includes('/trainers/10/boxes')) {
                return Promise.resolve({ok: true, json: () => Promise.resolve([{id:1,name:'Smoke Box'},{id:2,name:'Other Box'}])});
            }
            if (url.includes('/pokemons/11') && opts?.method === 'PATCH') {
                return Promise.resolve({ok:true, json: () => Promise.resolve({})});
            }
            return Promise.resolve({ok:true, json: () => Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/boxes/1"]}>
                <Routes>
                    <Route path="/boxes/:boxId" element={<AuthProvider><BoxDetailPage /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/smoke box/i)).toBeInTheDocument());

        // click Déplacer un Pokémon to trigger enterMoveMode
        const moveBtn = screen.getByText(/déplacer un pokémon/i);
        fireEvent.click(moveBtn);

        await waitFor(() => expect(screen.getByText(/choisir une boîte de destination/i)).toBeInTheDocument());
    });

    it("renders PokemonDetail and shows heading", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "2");

        const p = {id: 1, trainerId: 2, species: "Pikachu", name: "Pika", level: 5, genderTypeCode: "MALE", isShiny: false, size: null, weight: null};

        // @ts-ignore
        global.fetch = vi.fn((url:string) => {
            if (url.includes('/pokemons/1')) return Promise.resolve({ok:true, json: () => Promise.resolve(p)});
            if (url.includes('/trainers/2')) return Promise.resolve({ok:true, json: () => Promise.resolve({id:2, login:'me'})});
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
    });

    it("performs a basic pokemon search", async () => {
        localStorage.setItem("token", "T");
        // @ts-ignore
        global.fetch = vi.fn((url:string) => {
            if (url.startsWith('http://localhost:8000/pokemons?')) return Promise.resolve({ok:true, json: () => Promise.resolve([{id:5, trainerId:1, species:'Bulbasaur', name:'B1', level:3, genderTypeCode:'NOT_DEFINED', isShiny:false}])});
            return Promise.resolve({ok:true, json: () => Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/pokemons/search"]}>
                <Routes>
                    <Route path="/pokemons/search" element={<AuthProvider><PokemonSearchPage /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/rechercher des pokémons/i)).toBeInTheDocument());
    });

    it("renders TradesList and TradeDetail", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "7");

        const trades = [{id:1, statusCode:'PROPOSITION', sender:{id:7}, receiver:{id:8}}];
        const raw = {id:1, statusCode:'PROPOSITION', sender:{id:7, pokemons:[11]}, receiver:{id:8, pokemons:[22]}};
        const trainer7 = {id:7, firstName:'A', lastName:'B', login:'a'};
        const trainer8 = {id:8, firstName:'C', lastName:'D', login:'c'};
        const p11 = {id:11, species:'P', name:'P1', level:5, genderTypeCode:'MALE', isShiny:false};
        const p22 = {id:22, species:'Q', name:'Q1', level:6, genderTypeCode:'FEMALE', isShiny:false};

        // @ts-ignore
        global.fetch = vi.fn((url:string) => {
            if (url.endsWith('/trades')) return Promise.resolve({ok:true, json: () => Promise.resolve(trades)});
            if (url.includes('/trades/1')) return Promise.resolve({ok:true, json: () => Promise.resolve(raw)});
            if (url.includes('/trainers/7')) return Promise.resolve({ok:true, json: () => Promise.resolve(trainer7)});
            if (url.includes('/trainers/8')) return Promise.resolve({ok:true, json: () => Promise.resolve(trainer8)});
            if (url.includes('/pokemons/11')) return Promise.resolve({ok:true, json: () => Promise.resolve(p11)});
            if (url.includes('/pokemons/22')) return Promise.resolve({ok:true, json: () => Promise.resolve(p22)});
            return Promise.resolve({ok:true, json: () => Promise.resolve({})});
        });

        // Trades list
        render(
            <MemoryRouter initialEntries={["/trades"]}>
                <Routes>
                    <Route path="/trades" element={<AuthProvider><TradesListPage /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/échanges/i)).toBeInTheDocument());

        // Trade detail
        render(
            <MemoryRouter initialEntries={["/trades/1"]}>
                <Routes>
                    <Route path="/trades/:tradeId" element={<AuthProvider><TradeDetailPage /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/échange #1/i)).toBeInTheDocument());
    });
});
