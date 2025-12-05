import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import TradeDetailPage from "../src/pages/trades/TradeDetailPage";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("TradeDetailPage basic render", () => {
    it("renders trade details when fetch returns data", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "3");

        // render within a MemoryRouter so useParams works without spying
        // Mock the multiple fetch calls sequence
        // 1: /trades/1 -> raw
        // 2: /trainers/:id for sender and receiver
        // 3: /pokemons/:id for each pokemon
        // We'll return simple but compatible shapes
        const raw = {id:1, statusCode:'PROPOSITION', sender:{id:7, pokemons:[11]}, receiver:{id:3, pokemons:[22]}};
        const trainer7 = {id:7, firstName:'A', lastName:'B', login:'a'};
        const trainer3 = {id:3, firstName:'C', lastName:'D', login:'c'};
        const p11 = {id:11, species:'P', name:'P1', level:5, genderTypeCode:'MALE', isShiny:false};
        const p22 = {id:22, species:'Q', name:'Q1', level:6, genderTypeCode:'FEMALE', isShiny:false};

        // @ts-ignore
        global.fetch = vi.fn((url:string) => {
            if (url.includes('/trades/1')) return Promise.resolve({ok:true, json:()=>Promise.resolve(raw)});
            if (url.includes('/trainers/7')) return Promise.resolve({ok:true, json:()=>Promise.resolve(trainer7)});
            if (url.includes('/trainers/3')) return Promise.resolve({ok:true, json:()=>Promise.resolve(trainer3)});
            if (url.includes('/pokemons/11')) return Promise.resolve({ok:true, json:()=>Promise.resolve(p11)});
            if (url.includes('/pokemons/22')) return Promise.resolve({ok:true, json:()=>Promise.resolve(p22)});
            return Promise.resolve({ok:true, json:()=>Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/trades/1"]}>
                <Routes>
                    <Route path="/trades/:tradeId" element={<AuthProvider><TradeDetailPage /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/échange #1/i)).toBeInTheDocument());
        expect(screen.getByText(/p1/i)).toBeInTheDocument();
    });
});
