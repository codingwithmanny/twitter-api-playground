// Imports
// ========================================================
import { useAuth } from '@/components/Providers/Auth';
import Head from 'next/head';
import { useState } from 'react';

// Page
// ========================================================
export default function Requests() {
    // State / Params
    const [requests, setRequests] = useState<any[]>([]);
    const auth = useAuth();

    // Render
    return <>
        <Head>
            <title>Callback - Twitter API Playground</title>
            <meta name="description" content="Twitter API Playground" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex absolute top-[64px] bottom-0 left-0 right-0">
            <main className="p-8 w-full">
                <h1 className="mb-4">API Requests</h1>
                <p className="mb-8">Twitter API Requests.</p>

                <h2>Tweets</h2>

                <h3>Bookmarks</h3>

                <h3>Filtered Stream</h3>

                <h3>Hide Replies</h3>

                <h3>Likes</h3>

                <h3>Manage Tweets</h3>

                <h3>Quote Tweets</h3>

                <h3>Retweets</h3>

                <h3>Search Tweets</h3>

                <h3>Timelines</h3>

                <h3>Tweet Counts</h3>

                <h4>GET /2/tweets/counts/all</h4>

                <form onSubmit={async (event) => {
                    event.preventDefault();
                    const request = `https://api.twitter.com/2/tweets/counts/all`;
                    try {
                        const response = await fetch(request, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${auth.code}`
                            },
                        });
                        const json = await response.json();
                        
                        setRequests((reqs => [...reqs, { request, response: json }]));
                    } catch (error: any) {
                        setRequests((reqs => [...reqs, { request, response: error?.message ?? 'Unknown error.' }]));
                    }
                }}>
                    <div className="mb-4">
                        <button type="submit">Submit</button>
                    </div>
                </form>

                <h4>GET /2/tweets/counts/recent</h4>

                <h3>Tweet Lookup</h3>

                <h3>Volume Streams</h3>
            </main>
            <aside className="bg-zinc-800 w-full max-w-xl p-8 absolute top-0 bottom-0 right-0 overflow-scroll">
                <div className="mb-8">
                    <label>responses</label>
                    <pre><code>{JSON.stringify(requests, null, ' ')}</code></pre>
                </div>
            </aside>
        </div>
    </>
};