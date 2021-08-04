import axios from 'axios'
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { validationMiddleware } from '../auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        await validationMiddleware(req, res)

        const { access_token } = req.cookies
        const { id } = req.query
        if (!access_token) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized. Sign In with Spotify to continue',
            })
            return
        }

        const response = await executeRequest(access_token, id as string)
        if (response.success) {
            res.status(response.status).json({ data: response.data })
        } else {
            res.status(response.status).json({ ...response })
        }
    } else {
        res.json({ success: false, message: 'Method now allowed' })
    }
}

async function executeRequest(access_token: string, playlistId: string) {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        let data = response.data
        return { data, status: response.status, success: true }
    } catch (error) {
        console.log('Error while fetching playlist!')
        if (error.response) {
            return {
                success: false,
                status: error.response.data.error.status,
                message: error.response.data.error.message,
            }
        } else {
            return {
                success: false,
                status: 500,
                message: 'Internal server error. Try again later.',
            }
        }
    }
}
