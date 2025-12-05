import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import SubscribePage from "../src/pages/SubscribePage";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("SubscribePage actions", () => {
    it("submits signup form", async () => {
        // @ts-ignore
        global.fetch = vi.fn((url:string, opts?: any) => {
            if (url.includes('/auth/register') && opts?.method === 'POST') {
                return Promise.resolve({ok:true, json: () => Promise.resolve({id:1, firstName:'Test', lastName:'User'})});
            }
            return Promise.resolve({ok:true, json: () => Promise.resolve({})});
        });

        render(
            <MemoryRouter initialEntries={["/subscribe"]}>
                <Routes>
                    <Route path="/subscribe" element={<AuthProvider><SubscribePage /></AuthProvider>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/inscription/i)).toBeInTheDocument());

        // Fill form
        const firstNameInput = screen.getByLabelText(/prénom/i) as HTMLInputElement;
        const lastNameInput = screen.getByLabelText(/nom de famille/i) as HTMLInputElement;
        const loginInput = screen.getByLabelText(/adresse email/i) as HTMLInputElement;
        const birthDateInput = screen.getByLabelText(/date de naissance/i) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(/mot de passe/i) as HTMLInputElement;

        fireEvent.change(firstNameInput, {target: {value: 'Test'}});
        fireEvent.change(lastNameInput, {target: {value: 'User'}});
        fireEvent.change(loginInput, {target: {value: 'test@example.com'}});
        fireEvent.change(birthDateInput, {target: {value: '2000-01-01'}});
        fireEvent.change(passwordInput, {target: {value: 'password123'}});

        const btn = screen.getByRole('button', {name: /créer un compte|s'inscrire/i});
        fireEvent.click(btn);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    });
});
