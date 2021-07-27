import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { redirectURI } from '.'
import qs from 'qs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code
    if (!req.query.error && code) {
        try {
            const tokenGrantData = (
                await axios.post(
                    'https://accounts.spotify.com/api/token',
                    qs.stringify({
                        grant_type: 'authorization_code',
                        code,
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
        } catch (error) {
            res.send({ success: false, ...error.response.data })
        }
    } else {
        res.send({ success: false, error: req.query.error })
    }
}
