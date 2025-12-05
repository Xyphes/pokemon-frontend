import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import TradesListPage from "../src/pages/trades/TradesListPage";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("TradesListPage basic", () => {
    it("renders list when fetch returns trades", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "4");

        const list = [
                {id:1, statusCode:'PROPOSITION', sender:{id:10}, receiver:{id:4}},
            ];

            // @ts-ignore
            global.fetch = vi.fn((url: string) => {
                if (url.includes('/trades')) {
                    return Promise.resolve({ok:true, json:()=>Promise.resolve(list)});
                }
                return Promise.resolve({ok:true, json:()=>Promise.resolve({})});
            });

            render(
                <BrowserRouter>
                    <AuthProvider>
                        <TradesListPage />
                    </AuthProvider>
                </BrowserRouter>
            );

            await waitFor(() => expect(screen.getByText(/mes échanges/i)).toBeInTheDocument());
            expect(screen.getByText('#1')).toBeInTheDocument();
    });
});
// tests/TradesListPage.test.tsx
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TradesListPage from "../src/pages/trades/TradesListPage";
import { AuthProvider } from "../src/context/AuthContext";

describe("TradesListPage", () => {
    beforeEach(() => {
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => [],
        } as any);
    });

    afterEach(() => {
        (global.fetch as any).mockRestore();
    });

    it("affiche le titre des échanges", () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <TradesListPage />
                </AuthProvider>
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /échanges/i })
        ).toBeInTheDocument();
    });
});
