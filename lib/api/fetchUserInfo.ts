import { GetServerSidePropsContext } from 'next'
import { validationMiddleware } from '../../pages/api/auth'
import { executeRequest } from './fetchPlaylist'

export async function fetchUserInfo({ req, res }: GetServerSidePropsContext, href: string) {
    await validationMiddleware(req, res)

    const { access_token } = req.cookies
    if (!access_token) {
        return {
            success: false,
            status: 401,
            message: 'Unauthorized. Sign In with Spotify to continue',
        }
    }

    const response = await executeRequest(access_token, href)
    return { ...response }
}
