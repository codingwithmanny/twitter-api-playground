// Imports
// ========================================================
import { useEffect } from "react"
import AuthProvider from "./Auth";

// Component
// ========================================================
export default function Providers({ children }: { children: JSX.Element }) {
    useEffect(() => {
        console.log('Providers');
    }, [])

    return <>
        <AuthProvider>
            {children}
        </AuthProvider>
    </>
};