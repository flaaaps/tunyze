import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
    return (
        <>
            <h1 className={styles.title}>Hello</h1>
            <Link href="/api/auth">Authorize With Spotify</Link>
        </>
    )
}
