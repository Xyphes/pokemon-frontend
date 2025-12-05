// tests/LoginPage.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage";

const renderLogin = () =>
    render(
        <BrowserRouter>
            <LoginPage />
        </BrowserRouter>
    );

describe("LoginPage", () => {
    it("affiche le titre de connexion", () => {
        renderLogin();
        expect(
            screen.getByRole("heading", { name: /connexion/i })
        ).toBeInTheDocument();
    });

    it("affiche les champs email et mot de passe", () => {
        renderLogin();
        expect(
            screen.getByLabelText(/adresse email/i)
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(/mot de passe/i)
        ).toBeInTheDocument();
    });
});
