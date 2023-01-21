// Imports
// ========================================================
import Nav from '@/components/Nav';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

// Wrapper
// ========================================================
export default function App({ Component, pageProps }: AppProps) {
  return <><Nav /><Component {...pageProps} /></>
};
