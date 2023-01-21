// Imports
// ========================================================
import Link from 'next/link';

// Component
// ========================================================
export default function Nav() {
    return <nav className="flex justify-between items-center px-8 bg-zinc-700 h-16">
        <span className="font-semibold">Twitter API Playground</span>

        <ul className="flex gap-4">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/callback">Callback</Link></li>
        </ul>
    </nav>
};