// Imports
// ========================================================
import { useEffect, useState } from 'react';
import { useAuth } from '../Providers/Auth';

// Component
// ========================================================
export default function Debug() {
    const [storage, setStorage] = useState({
        payload: {},
        response: {}
    });
    const [isOpen, setIsOpen] = useState(false);
    const auth = useAuth();

    // Hooks
    useEffect(() => {
        setStorage({
            payload: auth.params,
            response: JSON.parse(auth.response || '{}')
        })
    }, [auth?.params, auth?.response]);

    // Render
    return <div className={`fixed ${isOpen ? 'bottom-0' : 'bottom-[-20rem]'} block left-0 right-0 h-full max-h-96 drop-shadow-2xl`}>
        <button onClick={() => setIsOpen(!isOpen)} className="rounded rounded-bl-none rounded-br-none bg-zinc-800 left-8 absolute">Debug</button>
        <div className="block absolute bg-zinc-800 top-12 bottom-0 left-0 right-0 overflow-scroll">
            <div className="p-8">
                <div className="mb-8">
                    <label>payload</label>
                    <pre><code>{JSON.stringify(storage?.payload, null, ' ')}</code></pre>
                </div>
                <div className="mb-8">
                    <label>response</label>
                    <pre><code>{JSON.stringify(storage?.response, null, ' ')}</code></pre>
                </div>
            </div>
        </div>
    </div>
};