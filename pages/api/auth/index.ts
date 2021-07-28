import type { NextApiRequest, NextApiResponse } from 'next'

export const redirectURI =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/callback'
        : 'https://hardboun.de/api/auth/callback'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
    res.redirect(
        `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirectURI}`
    )
}
