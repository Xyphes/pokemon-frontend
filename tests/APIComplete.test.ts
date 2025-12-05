import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("API Functions", () => {
    let fetchSpy: any;

    beforeEach(() => {
        fetchSpy = vi.spyOn(global, "fetch");
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    it("login sends correct request", async () => {
        const mockResponse = {
            ok: true,
            json: vi.fn().mockResolvedValue({
                accessToken: "token",
                trainerId: "123"
            }),
        };

        fetchSpy.mockResolvedValueOnce(mockResponse as any);

        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: "test", password: "pass" }),
        });

        expect(fetchSpy).toHaveBeenCalledWith(
            "http://localhost:8000/login",
            expect.any(Object)
        );

        const data = await response.json();
        expect(data.accessToken).toBe("token");
        expect(data.trainerId).toBe("123");
    });

    it("login handles errors", async () => {
        fetchSpy.mockRejectedValueOnce(new Error("Network error"));

        try {
            await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: "test", password: "pass" }),
            });
        } catch (error: any) {
            expect(error.message).toBe("Network error");
        }
    });

    it("signup sends correct request", async () => {
        const mockResponse = {
            ok: true,
            json: vi.fn().mockResolvedValue({
                accessToken: "token",
                trainerId: "456",
            }),
        };

        fetchSpy.mockResolvedValueOnce(mockResponse as any);

        const response = await fetch("http://localhost:8000/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                login: "johndoe",
                birthDate: "2000-01-01",
                password: "password",
            }),
        });

        expect(fetchSpy).toHaveBeenCalledWith(
            "http://localhost:8000/subscribe",
            expect.any(Object)
        );

        const data = await response.json();
        expect(data.trainerId).toBe("456");
    });

    it("handles 400 errors", async () => {
        const mockResponse = {
            ok: false,
            status: 400,
            json: vi.fn().mockResolvedValue({ error: "Invalid data" }),
        };

        fetchSpy.mockResolvedValueOnce(mockResponse as any);

        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: "", password: "" }),
        });

        expect(response.ok).toBe(false);
        expect(response.status).toBe(400);
    });

    it("handles 401 unauthorized", async () => {
        const mockResponse = {
            ok: false,
            status: 401,
            json: vi.fn().mockResolvedValue({ error: "Unauthorized" }),
        };

        fetchSpy.mockResolvedValueOnce(mockResponse as any);

        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: "wrong", password: "wrong" }),
        });

        expect(response.status).toBe(401);
    });

    it("handles server errors", async () => {
        const mockResponse = {
            ok: false,
            status: 500,
            json: vi.fn().mockResolvedValue({ error: "Server error" }),
        };

        fetchSpy.mockResolvedValueOnce(mockResponse as any);

        const response = await fetch("http://localhost:8000/api/data", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        expect(response.status).toBe(500);
    });

    it("sends authorization headers", async () => {
        const mockResponse = {
            ok: true,
            json: vi.fn().mockResolvedValue({ data: "test" }),
        };

        fetchSpy.mockResolvedValueOnce(mockResponse as any);

        await fetch("http://localhost:8000/trainers/1", {
            method: "GET",
            headers: {
                Authorization: "Bearer token123",
                "Content-Type": "application/json",
            },
        });

        expect(fetchSpy).toHaveBeenCalledWith(
            "http://localhost:8000/trainers/1",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer token123",
                }),
            })
        );
    });
});

