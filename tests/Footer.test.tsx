// tests/Footer.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "../src/components/Footer";

describe("Footer", () => {
    it("affiche du texte de bas de page", () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        expect(screen.getByText(/hyrule/i)).toBeInTheDocument();
    });
});
