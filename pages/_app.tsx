// Imports
// ========================================================
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Debug from '@/components/Debug';
import Nav from '@/components/Nav';
import Providers from '@/components/Providers';

// Wrapper
// ========================================================
export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Providers>
      <>
        <Nav />
        <Component {...pageProps} />
        <Debug />
      </>
    </Providers>
  </>
};
