import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export const redirectURI =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/callback'
        : 'https://hardboun.de/api/auth/callback'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query
        if (!req.cookies.token) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized! Sign in with Spotify to continue',
                status: 401,
            })
            return
        }
        const { access_token } = JSON.parse(req.cookies.token)

        try {
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
            let data = response.data
            res.status(res.statusCode).json({ data, status: response.status })
        } catch (error) {
            if (error.response) {
                res.status(error.response.data.error.status).json({
                    status: error.response.data.error.status,
                    message: error.response.data.error.message,
                })
            } else {
                res.status(500).json({
                    status: 500,
                    message: 'Internal server error. Try again later.',
                })
            }
        }
    } else {
        res.json({ success: false, message: 'Method now allowed' })
    }
}
