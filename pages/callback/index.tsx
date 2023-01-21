// Imports
// ========================================================
import { useEffect, useState } from 'react';

// Page
// ========================================================
export default function Callback() {
    // State / Params
    const [params, setParams] = useState('')

    // Effects
    useEffect(() => {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search).toString();
        setParams(searchParams);
    }, [])

    // Render
    return <>
        <main className="p-8 w-full">
          <h1 className="mb-4">Twitter API Playground Callback</h1>
          <pre><code>{params}</code></pre>
        </main>
    </>
};