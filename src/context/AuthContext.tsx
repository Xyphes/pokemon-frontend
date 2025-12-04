import { createContext, useContext, useState } from "react";

interface AuthContextType {
    logged: boolean;
    token: string | null;
    trainerId: string | null;
    login: (token: string, trainerId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    logged: false,
    token: null,
    trainerId: null,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem("token")
    );
    const [trainerId, setTrainerId] = useState<string | null>(() =>
        localStorage.getItem("trainerId")
    );

    const logged = Boolean(token);

    const login = (newToken: string, newTrainerId: string) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("trainerId", newTrainerId);
        setToken(newToken);
        setTrainerId(newTrainerId);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("trainerId");
        setToken(null);
        setTrainerId(null);
    };

    return (
        <AuthContext.Provider
            value={{ logged, token, trainerId, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
