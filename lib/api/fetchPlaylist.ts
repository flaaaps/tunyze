import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import { validationMiddleware } from '../../pages/api/auth'

export async function fetchPlaylistById({ req, res, params }: GetServerSidePropsContext) {
    await validationMiddleware(req, res)

    const { access_token } = req.cookies
    const id = params?.id
    if (!access_token) {
        return {
            success: false,
            status: 401,
            message: 'Unauthorized. Sign In with Spotify to continue',
        }
    }

    const response = await executeRequest(
        access_token,
        `https://api.spotify.com/v1/playlists/${id}`
    )
    return { ...response }
}

export async function executeRequest(access_token: string, href: string) {
    try {
        const response = await axios.get(href, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        let data = response.data
        return { data, status: response.status, success: true }
    } catch (error) {
        console.log('Error while fetching data!')
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
