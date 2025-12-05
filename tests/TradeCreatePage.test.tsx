import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import TradeCreatePage from "../src/pages/trades/TradeCreatePage";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("TradeCreatePage basic", () => {
    it("renders and posts when submitting", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "4");

        // render with initial search params via MemoryRouter
        // @ts-ignore
        global.fetch = vi.fn((url: string) => {
            // more specific routes first
            if (url.endsWith('/trades')) return Promise.resolve({ok:true, json: () => Promise.resolve({id:99})});
            if (url.endsWith('/pokemons')) return Promise.resolve({ok:true, json: () => Promise.resolve([{id:1,name:'P1',species:'P',level:5,isShiny:false}] )});
            if (url.includes('/trainers/4')) return Promise.resolve({ok: true, json: () => Promise.resolve({id:4, firstName:'Me', lastName:'X', login:'me'})});
            if (url.includes('/trainers/5')) return Promise.resolve({ok: true, json: () => Promise.resolve({id:5, firstName:'You', lastName:'Y', login:'you'})});
            return Promise.resolve({ok:true, json: () => Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/trades/create?receiverId=5"]}>
                <Routes>
                    <Route path="/trades/create" element={<AuthProvider><TradeCreatePage /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        // wait for load then select a pokemon button
        await waitFor(() => expect(fetch).toHaveBeenCalled());

        const buttons = await screen.findAllByText(/p1/i);
        // first button is from myPokemons, second from receiverPokemons
        fireEvent.click(buttons[0]);
        fireEvent.click(buttons[1]);

        const sendBtn = screen.getByRole('button', {name: /envoyer la proposition d’échange/i});
        fireEvent.click(sendBtn);

        await waitFor(() => expect(fetch).toHaveBeenCalled());
    });
});
// tests/TradeCreatePage.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TradeCreatePage from "../src/pages/trades/TradeCreatePage";

describe("TradeCreatePage", () => {
    it("affiche un titre de création d'échange", () => {
        render(
            <BrowserRouter>
                <TradeCreatePage />
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /nouvel échange/i })
        ).toBeInTheDocument();
    });
});
