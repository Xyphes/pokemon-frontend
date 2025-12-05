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
