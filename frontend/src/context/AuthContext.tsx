import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { api, setAuthToken } from '../lib/api';
import { jwtDecode } from 'jwt-decode';
import { STORAGE_KEYS } from '../constants/storage';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Auto-login on refresh ---
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (storedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.log('expired token')
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          setAuthToken(undefined);
        } else {
          console.log('good token')
          setAuthToken(storedToken);
          setUser({
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
          });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const decoded = jwtDecode<JwtPayload>(data.access_token);

    setAuthToken(data.access_token);
    setUser({
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setAuthToken(undefined);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
