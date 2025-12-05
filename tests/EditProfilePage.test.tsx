import {describe, it, beforeEach, vi, expect} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import EditProfilePage from "../src/pages/trainer/EditProfilePage";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "../src/context/AuthContext";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("EditProfilePage basic render", () => {
    it("renders form when logged", async () => {
        localStorage.setItem("token", "T");
        localStorage.setItem("trainerId", "5");

        // @ts-ignore
        global.fetch = vi.fn(() => Promise.resolve({ok: true, json: () => Promise.resolve({id:5, firstName: 'A', lastName: 'B'})}));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <EditProfilePage />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getByRole('heading')).toBeInTheDocument());
    });
});
