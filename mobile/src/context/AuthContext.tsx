import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/client";
import { STORAGE_KEYS } from "../constants";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, timezone: string, password: string, country_id?: number) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (stored) {
        setToken(stored);
        try {
          const me = await api.getMe();
          setUser(me);
        } catch {
          await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
        }
      }
      setLoading(false);
    })();
  }, []);

  const loginFn = async (phone: string, password: string) => {
    const res = await api.login(phone, password);
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const registerFn = async (phone: string, timezone: string, password: string, country_id?: number) => {
    const res = await api.register(phone, timezone, password, country_id);
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const me = await api.getMe();
    setUser(me);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login: loginFn, register: registerFn, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
