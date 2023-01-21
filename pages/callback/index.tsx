// Imports
// ========================================================
import { useAuth } from '@/components/Providers/Auth';
import Head from 'next/head';
import { useEffect } from 'react';

// Page
// ========================================================
export default function Callback() {
    // State / Params
    const auth = useAuth();

    // Effects
    useEffect(() => {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        auth.setAuth({
          code: searchParams.get('code') ?? '',
          state: searchParams.get('state') ?? '',
          response: searchParams.toString(), 
          isAuthenticated: searchParams.get('code') ? true : false
        });
    }, [])

    // Render
    return <>
        <Head>
            <title>Callback - Twitter API Playground</title>
            <meta name="description" content="Twitter API Playground" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="p-8 w-full">
          <h1 className="mb-4">Callback</h1>
          <p className="mb-4">Callback url which is redirected after the user has granted the application access.</p>

          <div className="mb-8">
            <label>response</label>
            <pre><code>{auth.response}</code></pre>
          </div>

          <div className="mb-8">
            <label>state</label>
            <input type="text" readOnly value={auth.state} />
          </div>

          <div className="mb-8">
            <label>code</label>
            <input type="text" readOnly value={auth.code} />
          </div>
        </main>
    </>
};