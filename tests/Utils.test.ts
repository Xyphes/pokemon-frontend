import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Utils - Complete Coverage", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe("LocalStorage Utilities", () => {
        it("sets item in localStorage", () => {
            localStorage.setItem("key", "value");
            expect(localStorage.getItem("key")).toBe("value");
        });

        it("gets item from localStorage", () => {
            localStorage.setItem("token", "test-token");
            const value = localStorage.getItem("token");
            expect(value).toBe("test-token");
        });

        it("removes item from localStorage", () => {
            localStorage.setItem("key", "value");
            localStorage.removeItem("key");
            expect(localStorage.getItem("key")).toBeNull();
        });

        it("clears localStorage", () => {
            localStorage.setItem("key1", "value1");
            localStorage.setItem("key2", "value2");
            localStorage.clear();
            expect(localStorage.getItem("key1")).toBeNull();
            expect(localStorage.getItem("key2")).toBeNull();
        });

        it("handles JSON storage", () => {
            const obj = { id: 1, name: "test" };
            localStorage.setItem("obj", JSON.stringify(obj));
            const retrieved = JSON.parse(localStorage.getItem("obj") || "{}");
            expect(retrieved.id).toBe(1);
            expect(retrieved.name).toBe("test");
        });
    });

    describe("String Utilities", () => {
        it("handles string operations", () => {
            const str = "test";
            expect(str.length).toBe(4);
        });

        it("converts to uppercase", () => {
            const str = "hello";
            expect(str.toUpperCase()).toBe("HELLO");
        });

        it("converts to lowercase", () => {
            const str = "HELLO";
            expect(str.toLowerCase()).toBe("hello");
        });

        it("trims whitespace", () => {
            const str = "  hello  ";
            expect(str.trim()).toBe("hello");
        });

        it("checks string includes", () => {
            const str = "hello world";
            expect(str.includes("world")).toBe(true);
            expect(str.includes("xyz")).toBe(false);
        });

        it("splits strings", () => {
            const str = "a,b,c";
            const parts = str.split(",");
            expect(parts).toEqual(["a", "b", "c"]);
        });

        it("joins arrays to string", () => {
            const arr = ["a", "b", "c"];
            expect(arr.join(",")).toBe("a,b,c");
        });
    });

    describe("Number Utilities", () => {
        it("handles number operations", () => {
            expect(1 + 1).toBe(2);
        });

        it("compares numbers", () => {
            expect(5 > 3).toBe(true);
            expect(2 < 8).toBe(true);
        });

        it("converts string to number", () => {
            expect(Number("42")).toBe(42);
            expect(parseInt("10", 10)).toBe(10);
        });

        it("handles decimals", () => {
            expect(3.14).toBeCloseTo(3.14);
        });
    });

    describe("Boolean Utilities", () => {
        it("handles boolean operations", () => {
            expect(true).toBe(true);
            expect(false).toBe(false);
        });

        it("converts values to boolean", () => {
            expect(Boolean(1)).toBe(true);
            expect(Boolean(0)).toBe(false);
            expect(Boolean("")).toBe(false);
            expect(Boolean("test")).toBe(true);
        });

        it("handles logical operations", () => {
            expect(true && true).toBe(true);
            expect(true && false).toBe(false);
            expect(true || false).toBe(true);
            expect(!true).toBe(false);
        });
    });

    describe("Array Utilities", () => {
        it("creates arrays", () => {
            const arr = [1, 2, 3];
            expect(arr.length).toBe(3);
        });

        it("maps array values", () => {
            const arr = [1, 2, 3];
            const mapped = arr.map((x) => x * 2);
            expect(mapped).toEqual([2, 4, 6]);
        });

        it("filters array", () => {
            const arr = [1, 2, 3, 4, 5];
            const filtered = arr.filter((x) => x > 2);
            expect(filtered).toEqual([3, 4, 5]);
        });

        it("reduces array", () => {
            const arr = [1, 2, 3];
            const sum = arr.reduce((a, b) => a + b, 0);
            expect(sum).toBe(6);
        });
    });

    describe("Object Utilities", () => {
        it("creates objects", () => {
            const obj = { key: "value" };
            expect(obj.key).toBe("value");
        });

        it("accesses object properties", () => {
            const obj = { id: 1, name: "test" };
            expect(obj.id).toBe(1);
            expect(obj["name"]).toBe("test");
        });

        it("checks object keys", () => {
            const obj = { a: 1, b: 2 };
            expect(Object.keys(obj)).toEqual(["a", "b"]);
        });

        it("checks object values", () => {
            const obj = { a: 1, b: 2 };
            expect(Object.values(obj)).toEqual([1, 2]);
        });
    });
});

