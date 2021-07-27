import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { redirectURI } from '.'
import qs from 'qs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const refreshToken = req.query.refresh_token

    if (!refreshToken) {
        res.send({ success: false, error: 'Refresh token missing' })
    } else {
        const tokenGrantData = (
            await axios.post(
                'https://accounts.spotify.com/api/token',
                qs.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    redirect_uri: redirectURI,
                    client_id: process.env.SPOTIFY_CLIENT_ID,
                    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            )
        ).data
        if (!tokenGrantData) {
            res.send({ success: false, error: 'Authentication failed' })
        } else {
            res.send({ success: true, ...tokenGrantData })
        }
    }
}
