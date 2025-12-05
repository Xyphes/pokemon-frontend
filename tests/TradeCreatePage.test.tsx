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
