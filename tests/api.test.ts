import {describe, it, expect, beforeEach, vi} from "vitest";
import {login, signup} from "../src/api";

beforeEach(() => {
    vi.restoreAllMocks();
    // ensure tests don't leak local fetch mocks
    // @ts-ignore
    if (global.fetch && (global.fetch as any).mockRestore) (global.fetch as any).mockRestore();
});

describe("api", () => {
    it("login returns json on success", async () => {
        const mockJson = {accessToken: "T", trainerId: "1"};
        // @ts-ignore
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockJson),
            })
        );

        const res = await login("user", "pass");

        expect(res).toEqual(mockJson);
        // @ts-ignore
        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8000/login",
            expect.objectContaining({method: "POST"})
        );
    });

    it("login throws on non-ok response", async () => {
        // @ts-ignore
        global.fetch = vi.fn(() => Promise.resolve({ok: false, status: 401}));

        await expect(login("u", "p")).rejects.toThrow("Login failed");
    });

    it("signup returns json on success", async () => {
        const mockJson = {accessToken: "S", trainerId: "2"};
        // @ts-ignore
        global.fetch = vi.fn(() =>
            Promise.resolve({ok: true, json: () => Promise.resolve(mockJson)})
        );

        const payload = {
            firstName: "A",
            lastName: "B",
            login: "user",
            birthDate: "2000-01-01",
            password: "pw",
        };

        const res = await signup(payload);

        expect(res).toEqual(mockJson);
        // @ts-ignore
        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8000/subscribe",
            expect.objectContaining({method: "POST"})
        );
    });

    it("signup throws on non-ok response", async () => {
        // @ts-ignore
        global.fetch = vi.fn(() => Promise.resolve({ok: false, status: 500}));

        await expect(
            signup({
                firstName: "A",
                lastName: "B",
                login: "user",
                birthDate: "2000-01-01",
                password: "pw",
            })
        ).rejects.toThrow("Signup failed");
    });
});
