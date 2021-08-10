import Link from 'next/link'

export default function Home() {
    return (
        <>
            <h1>Hello</h1>
            <p>You can analyse playlists here!</p>

            <Link href="/api/auth">Authorize With Spotify</Link>
        </>
    )
}
