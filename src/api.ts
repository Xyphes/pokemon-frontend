// src/api.ts
const API_URL = "http://localhost:8000";

export async function login(login: string, password: string) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({login, password})
    });

    if (!res.ok) throw new Error(`Login failed: ${res.status}`);
    return res.json(); // { accessToken, trainerId }
}

export async function signup(data: {
    firstName: string;
    lastName: string;
    login: string;
    birthDate: string;
    password: string;
}) {
    const res = await fetch(`${API_URL}/subscribe`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(`Signup failed: ${res.status}`);
    return res.json(); // { accessToken, trainerId }
}
