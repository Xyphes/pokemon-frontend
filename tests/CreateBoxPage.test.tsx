import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import CreateBoxPage from "../src/pages/box/CreateBoxPage";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("CreateBoxPage basic", () => {
    it("renders and posts when submitting", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "1");

        // @ts-ignore
        global.fetch = vi.fn((url: string) => {
            if (url.endsWith('/boxes')) return Promise.resolve({ok: true, json: () => Promise.resolve({id:2})});
            return Promise.resolve({ok: true, json: () => Promise.resolve({})});
        });

        render(
            <BrowserRouter>
                <AuthProvider>
                    <CreateBoxPage />
                </AuthProvider>
            </BrowserRouter>
        );

        // fill the name field
        fireEvent.change(screen.getByLabelText(/nom de la boîte/i), {target: {value: 'Test Box'}});

        const btn = screen.getByRole('button', {name: /créer la boîte/i});
        fireEvent.click(btn);

        await waitFor(() => expect(fetch).toHaveBeenCalled());
    });
});
// tests/CreateBoxPage.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CreateBoxPage from "../src/pages/box/CreateBoxPage";

describe("CreateBoxPage", () => {
    it("affiche le titre Nouvelle boîte d'Hyrule", () => {
        render(
            <BrowserRouter>
                <CreateBoxPage />
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /nouvelle boîte d'hyrule/i })
        ).toBeInTheDocument();
    });
});
