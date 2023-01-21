// Imports
// ========================================================
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { encode as base64encode } from "base64-arraybuffer";
import { useAuth } from '@/components/Providers/Auth';

// Helpers
// ========================================================
/**
 * 
 * @param count 
 * @returns 
 */
const randomStringGenerator = (count: number) => {
  let random = '';

  // 11 characters is the max amount of characters it can generate as a time
  const numberTimesToRunGenerate = Math.floor(count / 11) + 1;
  
  for (let i = 0; i < numberTimesToRunGenerate; i++) {
    random += `${Math.random().toString(36).slice(2)}`;
  }

  return random.slice(0, count);
};

// Constants
// ========================================================
/**
 * 
 */
const LS_REQUEST_KEY = "TAP_REQUEST";

/**
 * 
 */
const SCOPES: Array<{ name: string; description: string}> = [
  {
    name: 'tweet.read',
    description: 'All the Tweets you can view, including Tweets from protected accounts.'
  },
  {
    name: 'tweet.write',
    description: 'Tweet and Retweet for you.'
  },
  {
    name: 'tweet.moderate.write',
    description: 'Hide and unhide replies to your Tweets.'
  },
  {
    name: 'users.read',
    description: 'Any account you can view, including protected accounts.'
  },
  {
    name: 'follows.read',
    description: 'People who follow you and people who you follow.'
  },
  {
    name: 'follows.write',
    description: 'Follow and unfollow people for you.'
  },
  {
    name: 'offline.access',
    description: 'Stay connected to your account until you revoke access.'
  },
  {
    name: 'space.read',
    description: 'All the Spaces you can view.'
  },
  {
    name: 'mute.read',
    description: 'Accounts you’ve muted.'
  },
  {
    name: 'mute.write',
    description: 'Mute and unmute accounts for you.'
  },
  {
    name: 'like.read',
    description: 'Tweets you’ve liked and likes you can view.'
  },
  {
    name: 'like.write',
    description: 'Like and un-like Tweets for you.'
  },
  {
    name: 'list.read',
    description: 'Lists, list members, and list followers of lists you’ve created or are a member of, including private lists.'
  },
  {
    name: 'list.write',
    description: 'Create and manage Lists for you.'
  },
  {
    name: 'block.read',
    description: 'Accounts you’ve blocked.'
  },
  {
    name: 'block.write',
    description: 'Block and unblock accounts for you.'
  },
  {
    name: 'bookmark.read',
    description: 'Get Bookmarked Tweets from an authenticated user.'
  },
  {
    name: 'bookmark.write',
    description: 'Bookmark and remove Bookmarks from Tweets'
  },
];

/**
 * 
 */
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

// Page
// ========================================================
export default function Home() {
  // State / Params
  const [params, setParams] = useState(defaultParams);
  const [searchScope, setSearchScope] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const { setAuth, authReset, isAuthenticated, code } = useAuth();

  // Functions
  const onClickSignInWithTwitter = () => {
    console.group('onClickSignInWithTwitter');
    const scope = params.scope.map(s => s.name).join(' ');
    const url = new URL('https://twitter.com/i/oauth2/authorize');
    url.searchParams.set('response_type', params.response_type);
    url.searchParams.set('client_id', params.client_id);
    url.searchParams.set('state', params.state);
    url.searchParams.set('scope', scope);
    url.searchParams.set('redirect_uri', params.redirect_uri);
    url.searchParams.set('code_challenge', params.code_challenge);
    url.searchParams.set('code_challenge_method', params.code_challenge_method);

    console.log({ url: url.toString() });
    window.location.href = url.toString();
    console.groupEnd();
  }

  // Hooks
  useEffect(() => {
    const init = async () => {
      const existingParams = JSON.parse(localStorage.getItem(LS_REQUEST_KEY) ||  JSON.stringify(defaultParams));
      console.log({ existingParams });
      if (!existingParams?.redirect_uri) {
        existingParams.redirect_uri = `${window.location.origin}/callback`;
      }
      setParams(existingParams);
      setIsLoaded(true);

      const randString = randomStringGenerator(128);
      console.log({ randString });
      const encoder = new TextEncoder();
      const data = encoder.encode(randString);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      console.log({ digest });
      const base64Digest = base64encode(digest).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      console.log({ base64Digest });
      setParams(p => ({ ...p, code_challenge: base64Digest }));
    };
    init();
  }, []);

  // Hooks
  useEffect(() => {
    if (!isLoaded) return;
    setAuth((a: any) => ({ ...a, params }));
    console.log({ LS_REQUEST_KEY, params });
    localStorage.setItem(LS_REQUEST_KEY, JSON.stringify(params));
    // eslint-disable-next-line
  }, [params]);

  return (
    <>
      <Head>
        <title>Twitter API Playground</title>
        <meta name="description" content="Twitter API Playground" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex absolute top-[64px] bottom-0 left-0 right-0">
        <main className="p-8 w-full">
          <h1 className="mb-4">Authentication</h1>
          <p className="mb-4">Creating a PKCE (Proof Key for Code Exchange) with Twitter API 2.0.</p>
          {!isAuthenticated
            ? <button onClick={onClickSignInWithTwitter}>Sign in with Twitter</button>
            : <button onClick={() => authReset()}>Sign Out</button>}

          {isAuthenticated
            ? <section>

                <form onSubmit={async (event) => {
                    event.preventDefault();
                    const request = `/api/token`;
                    try {
                        const response = await fetch(request, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              code, 
                              client_id: params.client_id,
                              redirect_uri: `${window.location.origin}/callback`
                            })
                        });
                        const json = await response.json();
                        console.log({ json });
                    } catch (error: any) {
                      console.log({ error });
                    }
                }}>
                    <div className="mb-4">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </section>
            : ''
          }
        </main>
        <aside className="bg-zinc-800 w-full max-w-xl p-8 absolute top-0 bottom-0 right-0 overflow-scroll">
          <div className="mb-8">
            <label>response_type</label>
            <select onChange={(e) => {
              setParams(p => ({...p, response_type: e.target.value as 'code' | 'refresh_token' }));
            }} value={params.response_type}>
              <option value="code">code</option>
              <option value="refresh_token">refresh_token</option>
            </select>
          </div>
          <div className="mb-8">
            <label>client_id</label>
            <input type="text" value={params.client_id} onChange={(e) => setParams(p => ({ ...p, client_id: e.target.value }))} />
          </div>
          <div className="mb-8">
            <label>state</label>
            <input type="text" value={params.state} onChange={(e) => setParams(p => ({ ...p, state: e.target.value }))} />
          </div>
          <div className="mb-8">
            <label>scope</label>
            <div className="relative group mb-4">
              <input type="search" value={searchScope} onChange={(e) => setSearchScope(e.target.value)} />
              <div className="absolute group-hover:block hidden top-[48px] left-0 right-0 max-h-[160px] overflow-scroll rounded">
                {SCOPES.filter(scope => scope.name.toLowerCase().includes(searchScope.toLowerCase())).map((scope, index) => <span key={`scope-${index}`} onClick={() => {
                  if (!params.scope.find(s => s.name === scope.name)) {
                    setParams((p) => ({ ...p, scope: [...p.scope, scope ] }))
                  } else {
                    const i = params.scope.findIndex(s => s.name === scope.name);
                    setParams((p) => ({ ...p, scope: [...p.scope.slice(0, i), ...p.scope.slice(i + 1) ] }))
                  }
                }} className="flex justify-between cursor-pointer hover:bg-zinc-400 items-center px-3 text-zinc-500 border-b border-zinc-300 w-full h-10 bg-zinc-200">
                  {scope?.name}
                  <span>{params.scope.find(s => s.name === scope.name) ? '✅' : ''}</span>
                </span>)}
              </div>
            </div>

            {params.scope.map((scope, index) => 
              <div key={`scopeSelected-${index}`} className="bg-zinc-600 h-8 inline-block items-center w-auto rounded mr-4 mb-4">
                <div className="flex items-center">
                  <span className="block leading-8 pl-3 pr-2">{scope.name}</span>
                  <button onClick={() => {
                    const i = params.scope.findIndex(s => s.name === scope.name);
                    setParams((p) => ({ ...p, scope: [...p.scope.slice(0, i), ...p.scope.slice(i + 1) ] }))
                  }} className="bg-transparent px-3 h-auto leading-8 hover:bg-zinc-400 rounded-tr rounded-br rounded-tl-none rounded-bl-none">&times;</button>
                </div>
              </div>)}
          </div>

          <div className="mb-8">
            <label>redirect_uri</label>
            <input type="url" value={params.redirect_uri} onChange={(e) => setParams(p => ({ ...p, redirect_uri: e.target.value}))} />
          </div>
          <div className="mb-8">
            <label>code_challenge (S256)</label>
            <input type="text" readOnly value={params.code_challenge} />
          </div>
          <div className="mb-8">
            <label>code_challenge_method</label>
            <input type="text" readOnly value={params.code_challenge_method} />
          </div>
        </aside>
      </div>
    </>
  )
};
