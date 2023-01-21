export default function Nav() {
    return <nav className="flex justify-between items-center px-8 bg-zinc-700 h-16">
        <span className="font-semibold">Twitter API Playground</span>

        <ul className="flex gap-4">
            <li><a href="/">Home</a></li>
            <li><a href="/callback">Callback</a></li>
        </ul>
    </nav>
}