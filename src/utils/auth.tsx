import {createContext, type ReactNode, useContext, useEffect, useState} from "react";

type AuthContextType = {
    logged: boolean;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLogged(!!token);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setLogged(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setLogged(false);
    };

    return (
        <AuthContext.Provider value={{logged, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
}
