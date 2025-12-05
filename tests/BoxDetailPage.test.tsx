import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import BoxDetailPage from "../src/pages/box/BoxDetailPage";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("BoxDetailPage basic render", () => {
    it("shows loading then content when fetch returns a box", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "1");

        const box = {id: 1, name: "My Box", pokemons: []};
        // @ts-ignore
        global.fetch = vi.fn((url:string) => {
            if (url.includes('/boxes/1')) return Promise.resolve({ok:true, json:()=>Promise.resolve(box)});
            return Promise.resolve({ok:true, json:()=>Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/boxes/1"]}>
                <Routes>
                    <Route path="/boxes/:boxId" element={<AuthProvider><BoxDetailPage /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/my box/i)).toBeInTheDocument());
    });
});
