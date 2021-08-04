import axios from 'axios'
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { refreshAccessToken } from './refresh'

export const redirectURI =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/callback'
        : 'https://hardboun.de/api/auth/callback'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
    res.redirect(
        `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirectURI}`
    )
}

export async function validationMiddleware(req: NextApiRequest, res: NextApiResponse) {
    if (req.cookies.token) {
        let { access_token, refresh_token } = JSON.parse(req.cookies.token)

        if (!(await isValidAccessToken(access_token))) {
            console.log('Access token is invalid refreshing...')
            const refreshedTokenData = await refreshAccessToken(refresh_token)
            if (refreshedTokenData.success) {
                access_token = refreshedTokenData.access_token
                res.setHeader(
                    'Set-Cookie',
                    serialize(
                        'token',
                        JSON.stringify({
                            access_token: refreshedTokenData.access_token,
                            refresh_token,
                            expires_in: refreshedTokenData.expires_in,
                        }),
                        {
                            path: '/',
                        }
                    )
                )
            }
        }
        res.setHeader('Set-Cookie', serialize('testy', 'tadaaa'))
        req.cookies.access_token = access_token
    }
}

export async function isValidAccessToken(accessToken: string): Promise<boolean> {
    return new Promise((resolve) => {
        axios
            .get('https://api.spotify.com/v1/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .catch((err) => {
                const res = err.response
                const { data } = res
                if (data.error.status !== 401) {
                    // Expired or invalid token
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
    })
}
