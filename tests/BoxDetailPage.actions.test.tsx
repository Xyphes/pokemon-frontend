import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import BoxDetailPage from "../src/pages/box/BoxDetailPage";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("BoxDetailPage actions", () => {
    it("renames a box and moves a pokemon", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "10");

        const box = {id:1, name:'MyBox', pokemons:[{id:11, species:'P', name:'P1', level:5, genderTypeCode:'MALE', isShiny:false}]};
        const boxesList = [{id:1,name:'MyBox'},{id:2,name:'TargetBox'}];

        // mock fetch
        // @ts-ignore
        global.fetch = vi.fn((url:string, opts?: any) => {
            if (url.includes('/trainers/10/boxes/1') && (!opts || opts.method === undefined)) {
                return Promise.resolve({ok:true, json: () => Promise.resolve(box)});
            }
            if (url.includes('/trainers/10/boxes') && url.endsWith('/boxes')) {
                return Promise.resolve({ok:true, json: () => Promise.resolve(boxesList)});
            }
            if (url.includes('/trainers/10/boxes/1') && opts && opts.method === 'PATCH') {
                // rename
                return Promise.resolve({ok:true, json: () => Promise.resolve({id:1, name:JSON.parse(opts.body).name, pokemons: box.pokemons})});
            }
            if (url.includes('/pokemons/11') && opts && opts.method === 'PATCH') {
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

        // wait for box name
        await waitFor(() => expect(screen.getByText(/coffre\s*:\s*mybox/i)).toBeInTheDocument());

        // Click rename
        const renameBtn = screen.getByText(/renommer la boîte/i);
        fireEvent.click(renameBtn);

        const input = screen.getByLabelText(/nouveau nom de la boîte/i);
        fireEvent.change(input, {target: {value: 'Renamed'}});

        const validate = screen.getByText(/valider/i);
        fireEvent.click(validate);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        // Enter move mode
        const moveBtn = screen.getByText(/déplacer un pokémon/i);
        fireEvent.click(moveBtn);

        // wait for destination select
        await waitFor(() => expect(screen.getByText(/choisir une boîte de destination/i)).toBeInTheDocument());

        // select destination
        const select = screen.getByLabelText(/choisir une boîte de destination/i).closest('select') as HTMLSelectElement;
        fireEvent.change(select, {target: {value: '2'}});

        // select the pokemon (button inside list)
        const pbtn = await screen.findByLabelText(/sélectionner p1 pour déplacement/i);
        fireEvent.click(pbtn);

        const validateMove = screen.getByText(/valider le déplacement/i);
        fireEvent.click(validateMove);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    });
});
