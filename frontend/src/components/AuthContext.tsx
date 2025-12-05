"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
    user: any | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, storeName: string) => Promise<void>;
    logout: () => void;
    tenantId: string | null;
    setTenantId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:4000/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem('user');
        const storedTenant = localStorage.getItem('tenantId');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // Handle legacy string format or invalid JSON
                console.warn("Failed to parse stored user, clearing storage", e);
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        if (storedTenant) setTenantId(storedTenant);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password });
            const { user, tenantId } = res.data;
            setUser(user);
            setTenantId(tenantId);
            localStorage.setItem('user', JSON.stringify(user));
            if (tenantId) localStorage.setItem('tenantId', tenantId);
            router.push('/');
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (email: string, password: string, storeName: string) => {
        try {
            const res = await axios.post(`${API_URL}/register`, { email, password, storeName });
            const { user, tenantId } = res.data;
            setUser(user);
            setTenantId(tenantId);
            localStorage.setItem('user', JSON.stringify(user));
            if (tenantId) localStorage.setItem('tenantId', tenantId);
            router.push('/');
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setTenantId(null);
        localStorage.removeItem('user');
        localStorage.removeItem('tenantId');
        router.push('/login');
    };

    const updateTenantId = (id: string) => {
        setTenantId(id);
        localStorage.setItem('tenantId', id);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, tenantId, setTenantId: updateTenantId }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        return {
            user: null,
            login: async () => { },
            register: async () => { },
            logout: () => { },
            tenantId: null,
            setTenantId: () => { },
        };
    }
    return context;
}
