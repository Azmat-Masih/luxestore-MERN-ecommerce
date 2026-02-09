import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '../api/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const checkAuth = async () => {
            try {
                const userData = await authApi.getProfile();
                setUser(userData);
            } catch (error) {
                // Squelch 401s or other errors - just means not logged in
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const userData = await authApi.login({ email, password });
        setUser(userData);
    };

    const register = async (name: string, email: string, password: string) => {
        const userData = await authApi.register({ name, email, password });
        setUser(userData);
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
