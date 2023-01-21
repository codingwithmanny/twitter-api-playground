// Imports
// ========================================================
import { createContext, useContext, useEffect, useState } from "react";

// Constants
// ========================================================
/**
 * 
 */
const LS_RESPONSE_KEY = "TAP_RESPONSE";

const defaultParams: {
    response_type: 'code' | 'refresh_token';
    client_id: string;
    state: string;
    scope: Array<{ name: string; description: string}>,
    redirect_uri: string;
    code_challenge: string;
    code_challenge_method: 'S256' | 'plaintext',
  } = {
    response_type: 'code',
    client_id: '',
    state: 'state',
    scope: [],
    redirect_uri: '',
    code_challenge: '',
    code_challenge_method: 'S256',
  };


const init = {
    response: '',
    code: '',
    state: '',
    setAuth: (_payload: any) => {},
    params: defaultParams,
    isAuthenticated: false,
}

// Context Config
// ========================================================
const AuthContext = createContext({
    response: '',
    code: '',
    state: '',
    setAuth: (_payload: any) => {},
    authReset: () => {},
    params: defaultParams,
    isAuthenticated: false,
});

// Provider
// ========================================================
export default function AuthProvider({ children }: { children: JSX.Element }) {
    // State / Props
    const [auth, setAuth] = useState({
        response: '',
        code: '',
        state: '',
        params: defaultParams,
        isAuthenticated: false,
    });

    const authReset = () => {
        setAuth(init);
    };

    // Hooks
    useEffect(() => {
        localStorage.setItem(LS_RESPONSE_KEY, auth.response);
    }, [auth?.response]);

    // Return
    return <AuthContext.Provider value={{ ...auth, authReset, setAuth }}>{children}</AuthContext.Provider>
};

// Hook
// ========================================================
export const useAuth = () => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('Not wrapped with AuthProvider');
    }
    return auth;
};
